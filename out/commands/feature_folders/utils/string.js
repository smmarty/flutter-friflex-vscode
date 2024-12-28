"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCaseToSnakeCase = camelCaseToSnakeCase;
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.toPascalCase = toPascalCase;
exports.toSnakeCase = toSnakeCase;
/// Функция преобразует строку из формата camelCase или строки с пробелами в snake_case
/// Например: "authSuper" или "auth super" → "auth_super"
function camelCaseToSnakeCase(input) {
    return input
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/\s+/g, '_')
        .toLowerCase();
}
/// Функция делает первую букву строки заглавной и преобразует каждое слово в строке
/// Например: "auth_super" → "AuthSuper"
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