"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dtoTemplate = dtoTemplate;
/// Шаблон содержимого файла DTO (Data Transfer Object).
/// Принимает:
/// - [featureName]: название модуля, для которого создаётся DTO.
/// - [capitalizedFeature]: название модуля с заглавной буквы, используемое
///   для формирования имени класса (например, если featureName = "auth", 
///   то capitalizedFeature = "Auth").
/// Возвращает:
/// Строку с содержимым файла DTO.
function dtoTemplate(featureName, capitalizedFeature) {
    return `/// DTO для модуля ${featureName}
class ${capitalizedFeature}Dto {}`;
}
//# sourceMappingURL=dto_template.js.map