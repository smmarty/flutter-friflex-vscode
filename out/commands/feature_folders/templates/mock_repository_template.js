"use strict";
/// Шаблон содержимого файла мок репозитория.
/// Принимает:
/// - [featureName]: название модуля, для которого создаётся репозиторий.
/// - [capitalizedFeature]: название модуля с заглавной буквы, используемое в названии класса
///   (например, для featureName = "auth", capitalizedFeature = "Auth").
/// Возвращает:
/// Строку с содержимым файла, включающую импорт интерфейса репозитория и определение класса
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRepositoryTemplate = mockRepositoryTemplate;
const string_1 = require("../utils/string");
/// репозитория, реализующего этот интерфейс.
function mockRepositoryTemplate(featureName, capitalizedFeature) {
    return `import '../../domain/repository/i_${(0, string_1.camelCaseToSnakeCase)(featureName)}_repository.dart';

/// Мок репозиторий реализующий интерфейс I${capitalizedFeature}Repository
class ${capitalizedFeature}RepositoryMock implements I${capitalizedFeature}Repository {}`;
}
//# sourceMappingURL=mock_repository_template.js.map