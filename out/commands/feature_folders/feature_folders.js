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
/**
 * Registers the 'Create Feature Folders' command in VS Code.
 *
 * Prompts the user to enter a feature module name and generates a folder
 * structure based on the provided name. The folder structure follows the
 * Clean Architecture principles and includes data, domain, and presentation
 * directories with files. The command checks the configuration settings to
 * determine whether to add a prefix 'I' to interfaces and uses the appropriate
 * configuration file for folder structure.
 *
 * @param {vscode.ExtensionContext} context - The extension context provided by VS Code.
 */
function registerCreateFeatureFoldersCommand(context) {
    const disposable = vscode.commands.registerCommand('extension.createFeatureFolders', async (uri) => {
        // Prompt the user to enter a feature module name
        const featureName = await vscode.window.showInputBox({
            prompt: 'Enter the module name',
            placeHolder: 'For example: auth or auth sms'
        });
        // Check if the feature module name is provided
        if (!featureName) {
            vscode.window.showErrorMessage('You must enter the module name');
            return;
        }
        // Get the configuration settings    
        const addPrefixI = vscode.workspace.getConfiguration().get(consts_1.settingsAddPrefixI, true);
        // Generate the folder target
        const targetPath = uri.fsPath;
        // Convert folder name to snake_case
        const featurePath = path.join(targetPath, (0, string_1.camelCaseToSnakeCase)(featureName));
        // Get current config
        const currentConfig = addPrefixI ? consts_1.configIFeaturesFolders : consts_1.configFeaturesFolders;
        // Get root path
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
        // Check if config exists
        addPrefixI ? (0, files_1.checkAvailableConfigInFolder)(__dirname, consts_1.configIFeaturesFolders) : (0, files_1.checkAvailableConfigInFolder)(__dirname, consts_1.configFeaturesFolders);
        // Path to config
        const pathToConfig = path.join(rootPath, `${consts_1.configFolderName}/${currentConfig}`);
        // Create folder structure
        createStructureFromJson(pathToConfig, featurePath, featureName);
    });
    /**
     * Creates the folder structure and files from a given JSON configuration
     * file and a base path. The method replaces placeholders in the file
     * names and contents with the actual feature name in snake_case and PascalCase.
     * If any errors occur when creating the folders or files, the method will
     * show an error message.
     * @param {string} jsonPath - The path to the JSON configuration file.
     * @param {string} basePath - The base path for the folder structure.
     * @param {string} featureName - The name of the feature module.
     */
    function createStructureFromJson(jsonPath, basePath, featureName) {
        // Read the JSON configuration file
        const config = fs.readFileSync(jsonPath, 'utf8');
        // Parse the JSON string to a FolderStructure object
        const structure = JSON.parse(config);
        // Convert the feature name to PascalCase and snake_case
        const pascalCaseFeatureName = (0, string_1.toPascalCase)(featureName);
        const snakeCaseFeatureName = (0, string_1.toSnakeCase)(featureName);
        // Create the folder structure
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
        // Create the files
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