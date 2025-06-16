type Unit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
type DateLike = string | number | Date;

/**
 * Creates a fluent, immutable date utility wrapper around a given date.
 *
 * Supports manipulation, comparison, formatting, and localization.
 *
 * @throws {Error} If the provided input date is invalid.
 */
export function date(input: DateLike = new Date()) {
	const d = input instanceof Date ? new Date(input.getTime()) : new Date(input);
	if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${input}`);

	return {
		/** Returns a fresh copy of the native `Date` representing the internal timestamp */
		get raw() {
			return new Date(d.getTime());
		},
		/** Returns a new `date()` instance with the same timestamp */
		clone() {
			return date(d);
		},

		/** Returns a new `date()` instance with the specified time added */
		add(amount: number, unit: Unit) {
			const next = this.raw;
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

		/** Returns a new `date()` instance with the specified time subtracted */
		subtract(amount: number, unit: Unit) {
			return this.add(-amount, unit);
		},

		/** Computes the time difference between this date and the `other` */
		delta(other: DateLike) {
			const from = date(other).raw;
			const ms = d.getTime() - from.getTime();
			return {
				/** Returns the raw time difference in milliseconds */
				get milliseconds() {
					return ms;
				},
				/** Returns the time difference in seconds */
				get seconds() {
					return ms / 1000;
				},
				/** Returns the time difference in minutes */
				get minutes() {
					return ms / 60_000;
				},
				/** Returns the time difference in hours */
				get hours() {
					return ms / 3_600_000;
				},
				/** Returns the time difference in days */
				get days() {
					return ms / 86_400_000;
				},
				/** Returns the time difference in months, adjusted for day of month */
				get months() {
					const years = d.getFullYear() - from.getFullYear();
					const months = d.getMonth() - from.getMonth();
					const adjust = d.getDate() < from.getDate() ? -1 : 0;
					return years * 12 + months + adjust;
				},
				/** Returns the time difference in years, derived from months */
				get years() {
					return this.months / 12;
				},
			};
		},

		/** A set of boolean checks and comparisons for the current date */
		is: {
			/** True if the date falls on the current day */
			get today() {
				const now = date().raw;
				return (
					d.getFullYear() === now.getFullYear() &&
					d.getMonth() === now.getMonth() &&
					d.getDate() === now.getDate()
				);
			},
			/** True if the date is exactly one day before today */
			get yesterday() {
				const yesterday = new Date(d);
				yesterday.setDate(d.getDate() - 1);
				return (
					d.getFullYear() === yesterday.getFullYear() &&
					d.getMonth() === yesterday.getMonth() &&
					d.getDate() === yesterday.getDate()
				);
			},
			/** True if the date is exactly one day after today */
			get tomorrow() {
				const tomorrow = new Date(d);
				tomorrow.setDate(d.getDate() + 1);
				return (
					d.getFullYear() === tomorrow.getFullYear() &&
					d.getMonth() === tomorrow.getMonth() &&
					d.getDate() === tomorrow.getDate()
				);
			},

			/** True if the date falls between Monday and Friday */
			get weekday() {
				const day = d.getDay();
				return day >= 1 && day <= 5;
			},
			/** True if the date is Saturday or Sunday */
			get weekend() {
				const day = d.getDay();
				return day === 0 || day === 6;
			},
			/** True if the date's year is a leap year */
			get leap() {
				const year = d.getFullYear();
				return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
			},

			/** True if the date is before the given date */
			before(other: DateLike) {
				return d.getTime() < new Date(other).getTime();
			},
			/** True if the date is after the given date */
			after(other: DateLike) {
				return d.getTime() > new Date(other).getTime();
			},
			/** True if the date is the same as the given date */
			same(other: DateLike) {
				return d.getTime() === new Date(other).getTime();
			},
		},

		to: {
			/**
			 * Returns a localized, human-readable relative time string such as "yesterday", "in 2 hours", "3 months ago", etc.
			 *
			 * Falls back to "now" if the difference is negligible.
			 */
			relative(base: DateLike = new Date(), locale: Intl.LocalesArgument = 'en') {
				const intl = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
				const delta = d.getTime() - date(base).raw.getTime();
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
					return intl.format(value, unit);
				}
				return intl.format(0, 'second');
			},
		},

		/**
		 * Returns a formatted string of the current date based on a mask pattern.
		 * Supports common patterns (e.g. `YYYY-MM-DD`) and localized weekday/month names.
		 *
		 * Default format: `YYYY-MM-DDTHH:mm:ssZZZ`
		 * Locale affects the output of tokens like `MMM`, `MMMM`, `DDD`, `DDDD`.
		 *
		 * Token reference:
		 * - Date: `D`, `DD`
		 * - Weekday: `DDD`, `DDDD`
		 * - Month: `M`, `MM`, `MMM`, `MMMM`
		 * - Year: `YY`, `YYYY`
		 * - Hour (24): `H`, `HH`
		 * - Hour (12): `h`, `hh`
		 * - Minute: `m`, `mm`
		 * - Second: `s`, `ss`
		 * - Meridiem: `a`, `A`, `p`, `P`
		 * - Timezone: `Z`, `ZZ`, `ZZZ`
		 * - Literal text: wrap in square brackets `[like this]`
		 */
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

			const tokens: Record<string, string | number> = {
				D: now.date,
				DD: pad(now.date),

				M: now.month + 1,
				MM: pad(now.month + 1),

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

			const EXP = /D{1,4}|M{1,4}|YY(?:YY)?|([hHmsAPap])\1?|Z{1,3}|\[([^\]\[]|\[[^\[\]]*\])*\]/g;
			return (mask = 'YYYY-MM-DDTHH:mm:ssZZZ', locale: Intl.LocalesArgument = 'en') => {
				const intl = new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long' });
				const day = intl.formatToParts(d).find(({ type }) => type === 'weekday')?.value || '';
				const month = intl.formatToParts(d).find(({ type }) => type === 'month')?.value || '';
				tokens.DDD = day.slice(0, 3);
				tokens.DDDD = day;
				tokens.MMM = month.slice(0, 3);
				tokens.MMMM = month;

				return mask.replace(EXP, ($) => {
					const exe = tokens[$ as keyof typeof tokens];
					return `${exe || ''}` || $.slice(1, $.length - 1);
				});
			};
		},
	};
}
