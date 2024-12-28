"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainRepositoryInterfaceTemplate = domainRepositoryInterfaceTemplate;
/// Шаблон содержимого файла интерфейса репозитория.
/// Принимает:
/// [featureName] - название модуля
/// [className] - название класса
/// Возвращает:
/// Просто строку с содержимым файла
function domainRepositoryInterfaceTemplate(featureName, className) {
    return `/// Интерфейс описывающий репозиторий - ${featureName}
abstract interface class ${className} {}`;
}
//# sourceMappingURL=domain_repository_interface_template.js.map