"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCaseToSnakeCase = camelCaseToSnakeCase;
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.toPascalCase = toPascalCase;
exports.toSnakeCase = toSnakeCase;
function camelCaseToSnakeCase(input) {
    return input
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/\s+/g, '_')
        .toLowerCase();
}
function capitalizeFirstLetter(input) {
    const camelCaseStr = camelCaseToSnakeCase(input);
    if (!camelCaseStr) {
        return camelCaseStr;
    }
    return camelCaseStr
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}
function toPascalCase(string) {
    return string
        .split(/[\s_]+/)
        .map(word => capitalizeFirstLetter(word))
        .join('');
}
function toSnakeCase(string) {
    return string
        .split(' ')
        .map(word => word.toLowerCase())
        .join('_');
}
//# sourceMappingURL=string.js.map