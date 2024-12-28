export function camelCaseToSnakeCase(input: string): string {
    return input
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/\s+/g, '_')
        .toLowerCase();
}

export function capitalizeFirstLetter(input: string): string {
    const camelCaseStr = camelCaseToSnakeCase(input);
    if (!camelCaseStr) { return camelCaseStr; }
    return camelCaseStr
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

export function toPascalCase(string: string): string {
    return string
        .split(/[\s_]+/)
        .map(word => capitalizeFirstLetter(word))
        .join('');
}

export function toSnakeCase(string: string): string {
    return string
        .split(' ')
        .map(word => word.toLowerCase())
        .join('_');
}
