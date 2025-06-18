/**
 * A drop-in replacement for `new RegExp()` with special characters from source string escaped. This is useful when the pattern is not known at compile time and is dynamically constructed.
 *
 * @param pattern passed in the form of string literal
 * @param flags unique set of characters from `d|g|i|m|s|u|y`
 * @returns dynamically constructed RegExp object
 */
export function regexp(pattern: string, flags?: string): RegExp {
	return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
}
