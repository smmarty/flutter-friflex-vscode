import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { configFolderName } from '../consts';

export async function readTemplateJson(config: string): Promise<any> {
    try {
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
        const templatePath = path.join(rootPath, `${configFolderName}/${config}`);
        const fileContent = await fs.promises.readFile(templatePath, 'utf8');

        return JSON.parse(fileContent);
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(`Error reading the file: ${config}`);
    }

}

export function generateClass(template: any, className: string): string {
    const importsJoined: string = template.imports.join('\n');

    const classBody = template.classStructure
        .map((line: string) => line.replace(/{className}/g, className))
        .join('\n');
    if (importsJoined.length === 0) {
        return `${classBody}\n`;
    } else {
        return `${importsJoined}\n\n${classBody}\n`;
    }
}
