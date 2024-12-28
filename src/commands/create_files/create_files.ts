import * as vscode from 'vscode';
import { createEntity } from './creators/create_entity';
import { createWidget } from './creators/create_widget';
import { configStatefulWidget, configStatelessWidget } from '../../consts';

export function registerCreateFilesCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.createEntity', () => createEntity(__dirname)),
        vscode.commands.registerCommand('extension.createStatelessWidget', () => createWidget(__dirname, configStatelessWidget)),
        vscode.commands.registerCommand('extension.createStatefulWidget', () => createWidget(__dirname, configStatefulWidget)),
    );
}






