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
export const createEntity = async (dirName: string) => {
    try {

        return await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Creating entity",
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Checking configuration..." });

            // Check if the "Equatable" feature is enabled for the entity.
            const isEntityWithEquatable = vscode.workspace.getConfiguration().get<boolean>(settingsEntityWithEquatable, true);

            // Select appropriate configuration and check its availability
            const currentConfig = isEntityWithEquatable ? configEntityWithEquatable : configEntity;
            await checkAvailableConfigInFolder(dirName, currentConfig);

            // Get the active text editor.
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage("No active editor found. Please open a file first.");
                return;
            }

            progress.report({ message: "Reading template..." });

            // Get the file path of the current document.
            const filePath = editor.document.fileName;

            // Read the JSON template for code generation.
            const template = await readTemplateJson(currentConfig);
            if (!template) {
                vscode.window.showErrorMessage(`Failed to load entity template from ${currentConfig}`);
                return;
            }

            progress.report({ message: "Generating code..." });

            // Extract the file name from the file path.
            const fileName = filePath.split(/[/\\]/).pop() ?? '';

            // Convert the file name to a class name (PascalCase).
            const className = fileName.replace('.dart', '');
            const normalizedClassName = convertPathToPascalCase(className);

            // Generate class code based on the template.
            const generatedCode = generateClass(template, normalizedClassName);

            // Define the position to insert the code (start of the file).
            const firstLine = new vscode.Position(0, 0);

            progress.report({ message: "Updating file..." });

            // Insert the generated code into the editor.
            await editor.edit(editBuilder => {
                editBuilder.insert(firstLine, generatedCode);
            });

            vscode.window.showInformationMessage(`Entity ${normalizedClassName} created successfully.`);
        });
    } catch (error) {
        console.error('Error creating entity:', error);
        vscode.window.showErrorMessage(`Error creating entity: ${error instanceof Error ? error.message : String(error)}`);
    }
};


