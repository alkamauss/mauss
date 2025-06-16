type Unit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
type DateLike = string | number | Date;

export function date(input: DateLike = new Date()) {
	const d = input instanceof Date ? new Date(input.getTime()) : new Date(input);
	if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${input}`);

	return {
		get raw() {
			return new Date(d.getTime());
		},
		clone() {
			return date(d);
		},

		add(amount: number, unit: Unit) {
			const next = new Date(d.getTime());
			switch (unit) {
				case 'millisecond':
					next.setMilliseconds(d.getMilliseconds() + amount);
					break;
				case 'second':
					next.setSeconds(d.getSeconds() + amount);
					break;
				case 'minute':
					next.setMinutes(d.getMinutes() + amount);
					break;
				case 'hour':
					next.setHours(d.getHours() + amount);
					break;
				case 'day':
					next.setDate(d.getDate() + amount);
					break;
				case 'month':
					next.setMonth(d.getMonth() + amount);
					break;
				case 'year':
					next.setFullYear(d.getFullYear() + amount);
					break;
			}
			return date(next);
		},

		subtract(amount: number, unit: Unit) {
			return this.add(-amount, unit);
		},

		delta(other: DateLike) {
			const ms = d.getTime() - new Date(other).getTime();
			return {
				get milliseconds() {
					return ms;
				},
				get seconds() {
					return ms / 1000;
				},
				get minutes() {
					return ms / 60_000;
				},
				get hours() {
					return ms / 3_600_000;
				},
				get days() {
					return ms / 86_400_000;
				},
				get months() {
					return ms / 2_629_746_000;
				},
				get years() {
					return ms / 31_556_952_000;
				},
			};
		},

		is: {
			get today() {
				const now = new Date();
				return (
					d.getFullYear() === now.getFullYear() &&
					d.getMonth() === now.getMonth() &&
					d.getDate() === now.getDate()
				);
			},
			get yesterday() {
				const yesterday = new Date(d);
				yesterday.setDate(d.getDate() - 1);
				return (
					d.getFullYear() === yesterday.getFullYear() &&
					d.getMonth() === yesterday.getMonth() &&
					d.getDate() === yesterday.getDate()
				);
			},
			get tomorrow() {
				const tomorrow = new Date(d);
				tomorrow.setDate(d.getDate() + 1);
				return (
					d.getFullYear() === tomorrow.getFullYear() &&
					d.getMonth() === tomorrow.getMonth() &&
					d.getDate() === tomorrow.getDate()
				);
			},
			get weekday() {
				const day = d.getDay();
				return day >= 1 && day <= 5;
			},
			get weekend() {
				const day = d.getDay();
				return day === 0 || day === 6;
			},
			get leap() {
				const year = d.getFullYear();
				return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
			},

			before(other: DateLike) {
				return d.getTime() < new Date(other).getTime();
			},
			after(other: DateLike) {
				return d.getTime() > new Date(other).getTime();
			},
			same(other: DateLike) {
				return d.getTime() === new Date(other).getTime();
			},
		},

		to: {
			relative(base = new Date()) {
				const delta = d.getTime() - base.getTime();
				const abs = Math.abs(delta);
				const units = [
					['year', 31_556_952_000],
					['month', 2_629_746_000],
					['day', 86_400_000],
					['hour', 3_600_000],
					['minute', 60_000],
					['second', 1000],
				] as const;

				for (const [unit, ms] of units) {
					if (abs < ms) continue;
					const value = Math.round(delta / ms);
					if (value === 0) return 'just now';
					return value > 0
						? `in ${value} ${unit}${value !== 1 ? 's' : ''}`
						: `${-value} ${unit}${-value !== 1 ? 's' : ''} ago`;
				}
				return 'just now';
			},
		},

		get format() {
			const pad = (n: number) => n.toString().padStart(2, '0');
			const now = {
				date: d.getDate(),
				day: d.getDay(),
				month: d.getMonth(),
				year: d.getFullYear(),
				hours: d.getHours(),
				minutes: d.getMinutes(),
				seconds: d.getSeconds(),
				marker: d.getHours() < 12 ? 'AM' : 'PM',
				get tzo() {
					const offset = d.getTimezoneOffset();
					const sign = offset <= 0 ? '+' : '-';
					const abs = Math.abs(offset);
					const tz = [Math.floor(abs / 60), abs % 60];
					return {
						short: `${sign}${tz[0]}`,
						long: `${sign}${pad(tz[0])}${pad(tz[1])}`,
						iso: `${sign}${pad(tz[0])}:${pad(tz[1])}`,
					};
				},
			};

			const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			const months = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			];

			const tokens = {
				D: now.date,
				DD: pad(now.date),
				DDD: days[now.day].slice(0, 3),
				DDDD: days[now.day],

				M: now.month + 1,
				MM: pad(now.month + 1),
				MMM: months[now.month].slice(0, 3),
				MMMM: months[now.month],

				YY: `${now.year}`.slice(2),
				YYYY: now.year,

				H: now.hours,
				HH: pad(now.hours),
				h: now.hours % 12 || 12,
				hh: pad(now.hours % 12 || 12),
				m: now.minutes,
				mm: pad(now.minutes),
				s: now.seconds,
				ss: pad(now.seconds),

				a: now.marker,
				p: now.marker,
				A: now.marker,
				P: now.marker,
				Z: now.tzo.short,
				ZZ: now.tzo.long,
				ZZZ: now.tzo.iso,
			};

			return (mask = 'YYYY-MM-DDTHH:mm:ssZZZ') => {
				const EXP = /D{1,4}|M{1,4}|YY(?:YY)?|([hHmsAPap])\1?|Z{1,3}|\[([^\]\[]|\[[^\[\]]*\])*\]/g;
				return mask.replace(EXP, ($) => {
					const exe = tokens[$ as keyof typeof tokens];
					return `${exe}` || $.slice(1, $.length - 1);
				});
			};
		},
	};
}
