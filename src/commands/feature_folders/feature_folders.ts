import * as path from 'path';
import * as vscode from 'vscode';
import { configFeaturesFolders, configFolderName, configIFeaturesFolders, settingsAddPrefixI } from '../../consts';
import { camelCaseToSnakeCase, toPascalCase, toSnakeCase } from '../../utils/string';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { checkAvailableConfigInFolder, createFileIfNotExists, createFolderIfNotExists, FolderStructure } from '../../utils/files';

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

export function registerCreateFeatureFoldersCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.createFeatureFolders', async (uri: vscode.Uri) => {
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
        const addPrefixI = vscode.workspace.getConfiguration().get<boolean>(settingsAddPrefixI, true);
        // Generate the folder target
        const targetPath = uri.fsPath;
        // Convert folder name to snake_case
        const featurePath = path.join(targetPath, camelCaseToSnakeCase(featureName));
        // Get current config
        const currentConfig = addPrefixI ? configIFeaturesFolders : configFeaturesFolders;
        // Get root path
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
        // Check if config exists
        await checkAvailableConfigInFolder(__dirname, currentConfig);
        // Path to config
        const pathToConfig = path.join(rootPath, `${configFolderName}/${currentConfig}`);
        // Create folder structure
        await createStructureFromJson(pathToConfig, featurePath, featureName);
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
     * @returns {Promise<void>}
     */
    async function createStructureFromJson(jsonPath: string, basePath: string, featureName: string): Promise<void> {
        try {
            // Read JSON configuration asynchronously
            const configBuffer = await fsPromises.readFile(jsonPath, 'utf8');
            
            // Parse JSON string to FolderStructure
            const structure: FolderStructure = JSON.parse(configBuffer);
            
            // Convert feature name to PascalCase and snake_case
            const pascalCaseFeatureName = toPascalCase(featureName);
            const snakeCaseFeatureName = toSnakeCase(featureName);
            
            // Create folders structure
            for (const folder of structure.folders) {
                const folderPath = path.join(basePath, folder);
                await createFolderIfNotExists(folderPath);
            }
            
            // Create files
            for (const file of structure.files) {
                const filePath = path.join(basePath, file.path.replace(/{file_name}/g, snakeCaseFeatureName));
                let content = file.content || '';
                
                if (file.template) {
                    let className = pascalCaseFeatureName;
                    content = file.template
                        .replace(/{file_name}/g, snakeCaseFeatureName)
                        .replace(/{class_name}/g, className);
                }
                
                await createFileIfNotExists(filePath, content);
            }
        } catch (error) {
            console.log(error);
            vscode.window.showErrorMessage(`Error creating folder structure: ${error}`);
        }
    }
    
    context.subscriptions.push(disposable);
}


