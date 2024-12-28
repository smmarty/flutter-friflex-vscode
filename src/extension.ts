import * as vscode from 'vscode';
import { registerCreateFeatureFoldersCommand } from './commands/feature_folders/feature_folders';
import { registerCreateFilesCommands } from './commands/create_files/create_files';

export function activate(context: vscode.ExtensionContext) {
	registerCreateFeatureFoldersCommand(context);
	registerCreateFilesCommands(context);
}

export function deactivate() { }
