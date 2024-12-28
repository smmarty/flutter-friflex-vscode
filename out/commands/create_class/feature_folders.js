"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCreateFeatureFoldersCommand = registerCreateFeatureFoldersCommand;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const conts_1 = require("../../conts");
const string_1 = require("../../utils/string");
const fs = __importStar(require("fs"));
const files_1 = require("../../utils/files");
function registerCreateFeatureFoldersCommand(context) {
    const disposable = vscode.commands.registerCommand('extension.createFeatureFolders', async (uri) => {
        // Вызываем поле для ввода названия модуля
        const featureName = await vscode.window.showInputBox({
            prompt: 'Введите название модуля',
            placeHolder: 'Например: auth или auth sms'
        });
        // Если пользователь не ввёл название, показываем ошибку и выходим
        if (!featureName) {
            vscode.window.showErrorMessage('Необходимо ввести название модуля');
            return;
        }
        // Получаем настройку добавления префикса 'I'
        const addPrefixI = vscode.workspace.getConfiguration().get('flutter-friflex.addPrefixI', true);
        // Инициализируем путь, где была вызвана команда
        const targetPath = uri.fsPath;
        // Инициализируем путь модуля
        const featurePath = path.join(targetPath, (0, string_1.camelCaseToSnakeCase)(featureName));
        // Текущая конфигурация в зависимости от настройки добавления префикса 'I'
        const currentConfig = addPrefixI ? conts_1.iFeaturesFoldersConfig : conts_1.featuresFoldersConfig;
        // Рутоый путь к проекту
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
        // Путь к папке с конфигурацией
        const projectConfigPath = path.join(rootPath, conts_1.folderConfigName);
        // Если папка с конфигурацией не существует, копируем дефолтную конфигурацию
        if (!fs.existsSync(projectConfigPath)) {
            const defaultConfigPath = path.join(__dirname, `../../../${conts_1.folderConfigName}`);
            (0, files_1.copyFolderSync)(defaultConfigPath, projectConfigPath);
        }
        // Путь к конфигурации
        const pathToConfig = path.join(rootPath, `${conts_1.folderConfigName}/${currentConfig}`);
        // Создаём структуру папок и файлов
        createStructureFromJson(pathToConfig, featurePath, featureName);
        // Отображаем сообщение об успешном создании модуля
        vscode.window.showInformationMessage(`Модуль "${featureName}" успешно создан в "${targetPath}"!`);
    });
    function createStructureFromJson(jsonPath, basePath, featureName) {
        // Читаем файл с конфигурацией
        const config = fs.readFileSync(jsonPath, 'utf8');
        // Парсим JSON
        const structure = JSON.parse(config);
        // Преобразуем название модуля в PascalCase и snake_case
        const pascalCaseFeatureName = (0, string_1.toPascalCase)(featureName);
        const snakeCaseFeatureName = (0, string_1.toSnakeCase)(featureName);
        // Создаём папки
        try {
            structure.folders.forEach(folder => {
                const folderPath = path.join(basePath, folder);
                (0, files_1.createFolderIfNotExists)(folderPath);
            });
        }
        catch (error) {
            console.log(error);
            vscode.window.showErrorMessage('Ошибка при создании папок');
        }
        // Создаём файлы и добавляем содержимое
        try {
            structure.files.forEach(file => {
                const filePath = path.join(basePath, file.path.replace(/{file_name}/g, snakeCaseFeatureName));
                let content = file.content || '';
                if (file.template) {
                    let className = pascalCaseFeatureName;
                    content = file.template
                        .replace(/{file_name}/g, snakeCaseFeatureName)
                        .replace(/{class_name}/g, className);
                }
                (0, files_1.createFileIfNotExists)(filePath, content);
            });
        }
        catch (error) {
            console.log(error);
            vscode.window.showErrorMessage('Ошибка при создании файлов');
        }
    }
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=feature_folders.js.map