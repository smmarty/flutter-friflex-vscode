/// Global functions for working with string

/**
 * Converts a camelCase string to snake_case.
 * 
 * This function identifies the boundaries between lowercase and uppercase
 * letters in a camelCase string and replaces them with an underscore,
 * converting the entire string to lowercase.
 * 
 * @param {string} input - The camelCase string to convert.
 * @returns {string} The converted snake_case string.
 */

export function camelCaseToSnakeCase(input: string): string {
    return input
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/\s+/g, '_')
        .toLowerCase();
}

/**
 * Converts a string to have its first letter capitalized.
 * 
 * This function first converts the string to snake_case using the
 * `camelCaseToSnakeCase` function, splits the string on underscores, and
 * then capitalizes the first letter of each sub-string. The resulting
 * strings are then joined together with no delimiter.
 * 
 * @param {string} input - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export function capitalizeFirstLetter(input: string): string {
    const camelCaseStr = camelCaseToSnakeCase(input);
    if (!camelCaseStr) { return camelCaseStr; }
    return camelCaseStr
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

/**
 * Converts a string to PascalCase.
 * 
 * This function splits the string on whitespace and underscores, capitalizes
 * the first letter of each sub-string, and then joins them together with no
 * delimiter.
 * 
 * @param {string} string - The string to convert.
 * @returns {string} The converted PascalCase string.
 */
export function toPascalCase(string: string): string {
    return string
        .split(/[\s_]+/)
        .map(word => capitalizeFirstLetter(word))
        .join('');
}

/**
 * Converts a string to snake_case.
 * 
 * This function splits the string on whitespace, converts each sub-string to
 * lowercase, and then joins them together with an underscore as the
 * delimiter.
 * 
 * @param {string} string - The string to convert.
 * @returns {string} The converted snake_case string.
 */
export function toSnakeCase(string: string): string {
    return string
        .split(' ')
        .map(word => word.toLowerCase())
        .join('_');
}
