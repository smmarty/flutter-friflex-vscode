import * as vscode from 'vscode';
import { checkAvailableConfigInFolder, convertPathToPascalCase } from '../../../utils/files';
import { generateClass, readTemplateJson } from '../../../utils/json';

/**
 * This function creates a widget in the specified directory.
 * It validates the availability of a given configuration and generates code
 * based on a template, inserting the result into the active editor.
 *
 * @param {string} dirName - The path to the directory where the widget will be
 * created.
 * @param {string} config - The name of the configuration file in the specified
 * directory.
 */
export const createWidget = async (dirName: string, config: string) => {
    // Check the availability of the specified configuration in the given folder.
    checkAvailableConfigInFolder(dirName, config);

    // Get the active text editor.
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        // If no editor is active, exit the function.
        return;
    }

    // Get the file path of the current document.
    const filePath = editor.document.fileName;

    // Read the JSON template for widget generation.
    const template = await readTemplateJson(config);

    // Extract the file name from the file path.
    const fileName = filePath.split('/').pop() ?? '';

    // Convert the file name to a class name (PascalCase).
    const className = fileName.replace('.dart', '');
    const normalizedClassName = convertPathToPascalCase(className);

    // Generate widget code based on the template.
    const generatedCode = generateClass(template, normalizedClassName);

    // Define the position to insert the generated code (start of the file).
    const firstLine = new vscode.Position(0, 0);

    // Insert the generated code into the active editor.
    editor.edit(editBuilder => {
        editBuilder.insert(firstLine, generatedCode);
    });
};
