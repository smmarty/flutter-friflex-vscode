import * as vscode from 'vscode';
import { findConstructors, isConstructor } from './add_comments_utils';

/**
 * Registers a command for adding comments to classes and constructors
 * in Dart files in VS Code.
 * 
 * @param {vscode.ExtensionContext} context - VS Code extension context
 */
export function registerAddClassCommentsCommand(context: vscode.ExtensionContext) {
    // Register the comment addition command
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.addClassComments', async () => {
            // Get active text editor
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active editor found');
                return;
            }

            // Check if a Dart file is open
            if (editor.document.languageId !== 'dart') {
                vscode.window.showWarningMessage('This command only works in Dart files');
                return;
            }

            // Call function to add comments
            await addCommentsToClassAndConstructor(editor);
        }),
    );
}

/**
 * Adds comments to classes and constructors in the current Dart file.
 * The function analyzes the file code, finds classes and their constructors,
 * and adds documentation comments to them if they don't exist yet.
 * 
 * @param {vscode.TextEditor} editor - Active text editor
 * @returns {Promise<void>}
 */
async function addCommentsToClassAndConstructor(editor: vscode.TextEditor): Promise<void> {
    // Get document text
    const document = editor.document;
    const text = document.getText();

    // Regular expression for finding classes
    // Looks for classes with potential modifiers and inheritance
    const classRegex = /(?:abstract\s+|final\s+|sealed\s+|base\s+|interface\s+)*class\s+(\w+)(?:\s+(?:extends|with|implements)[\s\w,<>]+)?\s*\{/g;

    // Create arrays for edits and class names
    let match;
    const edits: vscode.TextEdit[] = [];
    const classNames: string[] = [];

    // Find all classes in the document
    while ((match = classRegex.exec(text)) !== null) {
        const className = match[1];
        const position = document.positionAt(match.index);
        const lineIndex = position.line;

        // Check if comments already exist before the class
        let hasComments = false;
        for (let i = lineIndex - 1; i >= Math.max(0, lineIndex - 3); i--) {
            const line = document.lineAt(i).text.trim();
            if (line.startsWith('///') || line.startsWith('/**')) {
                hasComments = true;
                break;
            }
            // If we encounter a non-empty line that's not a comment, exit
            if (line !== '') {
                break;
            }
        }

        // If no comments exist, add them
        if (!hasComments) {
            // Create class comment using {@template}
            const classComment = `/// {@template ${className}}\n/// \n/// {@endtemplate}\n`;
            const insertPosition = new vscode.Position(lineIndex, 0);
            edits.push(vscode.TextEdit.insert(insertPosition, classComment));
        }

        // Store class name to search for constructors
        classNames.push(className);
    }

    // Find constructors for all discovered classes
    for (const className of classNames) {
        // Find all constructors using the enhanced method
        findConstructors(text, className, document, edits);
    }

    // Apply all changes to the document
    if (edits.length > 0) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.set(document.uri, edits);
        await vscode.workspace.applyEdit(workspaceEdit);

    } else {
        vscode.window.showInformationMessage('Comments already exist or no classes found');
    }
}



