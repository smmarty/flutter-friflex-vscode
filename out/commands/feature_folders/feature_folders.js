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
const consts_1 = require("../../consts");
const string_1 = require("../../utils/string");
const fs = __importStar(require("fs"));
const files_1 = require("../../utils/files");
function registerCreateFeatureFoldersCommand(context) {
    const disposable = vscode.commands.registerCommand('extension.createFeatureFolders', async (uri) => {
        const featureName = await vscode.window.showInputBox({
            prompt: 'Enter the module name',
            placeHolder: 'For example: auth or auth sms'
        });
        if (!featureName) {
            vscode.window.showErrorMessage('You must enter the module name');
            return;
        }
        const addPrefixI = vscode.workspace.getConfiguration().get(consts_1.settingsAddPrefixI, true);
        const targetPath = uri.fsPath;
        const featurePath = path.join(targetPath, (0, string_1.camelCaseToSnakeCase)(featureName));
        const currentConfig = addPrefixI ? consts_1.configIFeaturesFolders : consts_1.configFeaturesFolders;
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
        addPrefixI ? (0, files_1.checkAvailableConfigInFolder)(__dirname, consts_1.configIFeaturesFolders) : (0, files_1.checkAvailableConfigInFolder)(__dirname, consts_1.configFeaturesFolders);
        const pathToConfig = path.join(rootPath, `${consts_1.configFolderName}/${currentConfig}`);
        createStructureFromJson(pathToConfig, featurePath, featureName);
    });
    function createStructureFromJson(jsonPath, basePath, featureName) {
        const config = fs.readFileSync(jsonPath, 'utf8');
        const structure = JSON.parse(config);
        const pascalCaseFeatureName = (0, string_1.toPascalCase)(featureName);
        const snakeCaseFeatureName = (0, string_1.toSnakeCase)(featureName);
        try {
            structure.folders.forEach(folder => {
                const folderPath = path.join(basePath, folder);
                (0, files_1.createFolderIfNotExists)(folderPath);
            });
        }
        catch (error) {
            console.log(error);
            vscode.window.showErrorMessage(`Error when creating folders: ${error}`);
        }
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
            vscode.window.showErrorMessage(`Error when creating files: ${error}`);
        }
    }
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=feature_folders.js.map