import * as path from 'path';
import * as vscode from 'vscode';
import { configFeaturesFolders, configFolderName, configIFeaturesFolders, settingsAddPrefixI } from '../../consts';
import { camelCaseToSnakeCase, toPascalCase, toSnakeCase } from '../../utils/string';
import * as fs from 'fs';
import { checkAvailableConfigInFolder, createFileIfNotExists, createFolderIfNotExists, FolderStructure } from '../../utils/files';

export function registerCreateFeatureFoldersCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.createFeatureFolders', async (uri: vscode.Uri) => {
        const featureName = await vscode.window.showInputBox({
            prompt: 'Enter the module name',
            placeHolder: 'For example: auth or auth sms'
        });

        if (!featureName) {
            vscode.window.showErrorMessage('You must enter the module name');
            return;
        }

        const addPrefixI = vscode.workspace.getConfiguration().get<boolean>(settingsAddPrefixI, true);

        const targetPath = uri.fsPath;
        const featurePath = path.join(targetPath, camelCaseToSnakeCase(featureName));
        const currentConfig = addPrefixI ? configIFeaturesFolders : configFeaturesFolders;
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
        addPrefixI ? checkAvailableConfigInFolder(__dirname, configIFeaturesFolders) : checkAvailableConfigInFolder(__dirname, configFeaturesFolders);
        const pathToConfig = path.join(rootPath, `${configFolderName}/${currentConfig}`);
        createStructureFromJson(pathToConfig, featurePath, featureName);
    });

    function createStructureFromJson(jsonPath: string, basePath: string, featureName: string): void {
        const config = fs.readFileSync(jsonPath, 'utf8');
        const structure: FolderStructure = JSON.parse(config);
        const pascalCaseFeatureName = toPascalCase(featureName);
        const snakeCaseFeatureName = toSnakeCase(featureName);
        try {
            structure.folders.forEach(folder => {
                const folderPath = path.join(basePath, folder);
                createFolderIfNotExists(folderPath);
            });
        } catch (error) {
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
                createFileIfNotExists(filePath, content);
            });
        } catch (error) {
            console.log(error);
            vscode.window.showErrorMessage(`Error when creating files: ${error}`);
        }
    }
    context.subscriptions.push(disposable);
}


