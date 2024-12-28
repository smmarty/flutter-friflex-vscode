import * as vscode from 'vscode';
import { checkAvailableConfigInFolder, convertPathToPascalCase } from '../../../utils/files';
import { generateClass, readTemplateJson } from '../../../utils/json';

export const createWidget = async (dirName: string, config: string) => {

    checkAvailableConfigInFolder(dirName, config);

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const filePath = editor.document.fileName;
    const template = await readTemplateJson(config);
    const fileName = filePath.split('/').pop() ?? '';
    const className = fileName.replace('.dart', '');
    const normalizedClassName = convertPathToPascalCase(className);
    const generatedCode = generateClass(template, normalizedClassName);
    const firstLine = new vscode.Position(0, 0);
    editor.edit(editBuilder => {
        editBuilder.insert(firstLine, generatedCode);
    });
};
