import * as vscode from 'vscode';
import { checkAvailableConfigInFolder, convertPathToPascalCase } from '../../../utils/files';
import { configEntity, configEntityWithEquatable, settingsEntityWithEquatable } from '../../../consts';
import { generateClass, readTemplateJson } from '../../../utils/json';

/**
 * Registers the 'Create Entity' command in VS Code.
 *
 * Checks the configuration settings to determine whether to generate an entity
 * with equatable or not. If the setting is enabled, it uses the
 * `configEntityWithEquatable.json` configuration. Otherwise, it uses the
 * `configEntity.json` configuration.
 *
 * Copies the content of the configuration file to the `friflex_config` folder in
 * the project root if it does not exist.
 *
 * Gets the content of the configuration file and the name of the current file
 * in the active text editor. Replaces placeholders in the configuration file
 * with the actual file name in PascalCase. Inserts the generated code into the
 * active text editor at the beginning of the file.
 * @param {string} dirName - The path to the directory with the default configuration.
 */
// This function is responsible for creating an entity in the specified directory.
// It checks the configuration for whether the entity should use the "Equatable" package
// and generates code based on a template, inserting it into the currently active editor.

export const createEntity = async (dirName: string) => {
    // Check if the "Equatable" feature is enabled for the entity.
    const isEntityWithEquatable = vscode.workspace.getConfiguration().get<boolean>(settingsEntityWithEquatable, true);

    // If Equatable is enabled, check for the availability of the corresponding configuration.
    if (isEntityWithEquatable) {
        checkAvailableConfigInFolder(dirName, configEntityWithEquatable);
    } else {
        // Otherwise, check the standard configuration.
        checkAvailableConfigInFolder(dirName, configEntity);
    }

    // Determine which configuration to use.
    const currentConfig = isEntityWithEquatable ? configEntityWithEquatable : configEntity;

    // Get the active text editor.
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        // Exit the function if no editor is active.
        return;
    }

    // Get the file path of the current document.
    const filePath = editor.document.fileName;

    // Read the JSON template for code generation.
    const template = await readTemplateJson(currentConfig);

    // Extract the file name from the file path.
    const fileName = filePath.split('/').pop() ?? '';

    // Convert the file name to a class name (PascalCase).
    const className = fileName.replace('.dart', '');
    const normalizedClassName = convertPathToPascalCase(className);

    // Generate class code based on the template.
    const generatedCode = generateClass(template, normalizedClassName);

    // Define the position to insert the code (start of the file).
    const firstLine = new vscode.Position(0, 0);

    // Insert the generated code into the editor.
    editor.edit(editBuilder => {
        editBuilder.insert(firstLine, generatedCode);
    });
};


