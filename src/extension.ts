import * as vscode from 'vscode';
import { registerCreateFeatureFoldersCommand } from './commands/feature_folders/feature_folders';
import { registerCreateFilesCommands } from './commands/create_files/create_files';
import { registerAddClassCommentsCommand } from './commands/add_comments/add_comments';


/**
 * Called when the extension is activated.
 *
 * Registers all commands with VS Code
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
	// Register commands for creating feature folders
	registerCreateFeatureFoldersCommand(context);
	// Register commands for creating files
	registerCreateFilesCommands(context);
	// Register commands for adding comments to Dart files
	registerAddClassCommentsCommand(context);
}

/** Called when the extension is deactivated */
export function deactivate() { }
