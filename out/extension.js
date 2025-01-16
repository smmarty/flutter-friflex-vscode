"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const feature_folders_1 = require("./commands/feature_folders/feature_folders");
const create_files_1 = require("./commands/create_files/create_files");
/**
 * Called when the extension is activated.
 *
 * Registers all commands with VS Code
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Register commands for creating feature folders
    (0, feature_folders_1.registerCreateFeatureFoldersCommand)(context);
    // Register commands for creating files
    (0, create_files_1.registerCreateFilesCommands)(context);
}
/** Called when the extension is deactivated */
function deactivate() { }
//# sourceMappingURL=extension.js.map