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
    try {
        // Check the availability of the specified configuration in the given folder.
        await checkAvailableConfigInFolder(dirName, config);

        // Get the active text editor.
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            // If no editor is active, show a message and exit the function.
            vscode.window.showInformationMessage('No active editor found. Please open a file first.');
            return;
        }

        // Get the file path of the current document.
        const filePath = editor.document.fileName;

        // Read the JSON template for widget generation.
        const template = await readTemplateJson(config);
        if (!template) {
            vscode.window.showErrorMessage(`Failed to load template from config: ${config}`);
            return;
        }

        // Extract the file name from the file path.
        const fileName = filePath.split('/').pop() ?? '';

        // Convert the file name to a class name (PascalCase).
        const className = fileName.replace('.dart', '');
        const normalizedClassName = convertPathToPascalCase(className);

        // Generate widget code based on the template.
        const generatedCode = generateClass(template, normalizedClassName);

        // Define the position to insert the generated code (start of the file).
        const firstLine = new vscode.Position(0, 0);

        // Insert the generated code into the active editor with proper error handling.
        await editor.edit(editBuilder => {
            editBuilder.insert(firstLine, generatedCode);
        });

        // Success message
        vscode.window.showInformationMessage(`Widget ${normalizedClassName} created successfully.`);
    } catch (error) {
        console.error('Error creating widget:', error);
        vscode.window.showErrorMessage(`Error creating widget: ${error instanceof Error ? error.message : String(error)}`);
    }
};
