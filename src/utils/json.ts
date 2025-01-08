import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { configFolderName } from '../consts';

/// Global functions for working with json


/**
 * Reads the content of a given JSON file in the `.friflex_config` folder as JSON.
 * @param {string} config - The name of the JSON file.
 * @returns {Promise<any>} The content of the file as JSON.
 * @throws {vscode.MessageItem} An error message if the file does not exist or cannot be read.
 */
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

/**
 * Generates a class based on the given template and className.
 * Replaces `{className}` with the given className in the template.
 * If the template has imports, they are joined with newline and prepended to the class declaration.
 * @param {any} template - The template to generate the class from.
 * @param {string} className - The name of the class to generate.
 * @returns {string} The generated class as a string.
 */
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
