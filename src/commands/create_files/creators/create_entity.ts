import * as vscode from 'vscode';
import { checkAvailableConfigInFolder, convertPathToPascalCase } from '../../../utils/files';
import { configEntity, configEntityWithEquatable, settingsEntityWithEquatable } from '../../../consts';
import { generateClass, readTemplateJson } from '../../../utils/json';

export const createEntity = async (dirName: string) => {
    const isEntityWithEquatable = vscode.workspace.getConfiguration().get<boolean>(settingsEntityWithEquatable, true);
    if (isEntityWithEquatable) {
        checkAvailableConfigInFolder(dirName, configEntityWithEquatable);
    } else {
        checkAvailableConfigInFolder(dirName, configEntity);
    }
    const currentConfig = isEntityWithEquatable ? configEntityWithEquatable : configEntity;
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const filePath = editor.document.fileName;
    const template = await readTemplateJson(currentConfig);
    const fileName = filePath.split('/').pop() ?? '';
    const className = fileName.replace('.dart', '');
    const normalizedClassName = convertPathToPascalCase(className);
    const generatedCode = generateClass(template, normalizedClassName);
    const firstLine = new vscode.Position(0, 0);
    editor.edit(editBuilder => {
        editBuilder.insert(firstLine, generatedCode);
    });
};