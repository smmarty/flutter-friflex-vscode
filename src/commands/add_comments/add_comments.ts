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

            // Start adding comments with a progress indicator
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Adding documentation comments",
                cancellable: true
            }, async (progress, token) => {
                // Call function to add comments
                return await addCommentsToClassAndConstructor(editor, progress, token);
            });
        }),
    );
}

/**
 * Adds comments to classes and constructors in the current Dart file.
 * The function analyzes the file code, finds classes and their constructors,
 * and adds documentation comments to them if they don't exist yet.
 * 
 * @param {vscode.TextEditor} editor - Active text editor
 * @param {vscode.Progress<{message?: string; increment?: number}>} progress - Progress indicator
 * @param {vscode.CancellationToken} token - Cancellation token
 * @returns {Promise<void>}
 */
async function addCommentsToClassAndConstructor(
    editor: vscode.TextEditor, 
    progress?: vscode.Progress<{message?: string; increment?: number}>,
    token?: vscode.CancellationToken
): Promise<void> {
    try {
        // Get document text
        const document = editor.document;
        const text = document.getText();
        
        progress?.report({ message: "Analyzing file structure...", increment: 10 });
        if (token?.isCancellationRequested) {return;}

        // Create arrays for edits and class names
        const edits: vscode.TextEdit[] = [];
        const classNames: string[] = [];
        
        // Use async/await and minimize work in the loop
        await processClassesInDocument(document, text, edits, classNames, progress, token);
        
        if (token?.isCancellationRequested) {return;}
        progress?.report({ message: "Processing constructors...", increment: 40 });
        
        // Find constructors for all discovered classes
        if (classNames.length > 0) {
            await processConstructorsInDocument(text, classNames, document, edits, progress, token);
        }
        
        if (token?.isCancellationRequested) {return;}
        progress?.report({ message: "Applying changes...", increment: 30 });

        // Apply all changes to the document
        if (edits.length > 0) {
            const workspaceEdit = new vscode.WorkspaceEdit();
            workspaceEdit.set(document.uri, edits);
            await vscode.workspace.applyEdit(workspaceEdit);
            vscode.window.showInformationMessage(`Added comments to ${edits.length} locations`);
        } else {
            vscode.window.showInformationMessage('Comments already exist or no classes found');
        }
        
        progress?.report({ message: "Done!", increment: 20 });
    } catch (error) {
        console.error('Error adding comments:', error);
        vscode.window.showErrorMessage(`Error adding comments: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Processes all classes in the document to find locations where comments need to be added
 * 
 * @param document The document to process
 * @param text The full text of the document
 * @param edits Array to store edits
 * @param classNames Array to store found class names
 * @param progress Optional progress reporter
 * @param token Optional cancellation token
 */
async function processClassesInDocument(
    document: vscode.TextDocument,
    text: string,
    edits: vscode.TextEdit[],
    classNames: string[],
    progress?: vscode.Progress<{message?: string; increment?: number}>,
    token?: vscode.CancellationToken
): Promise<void> {
    // Regular expression for finding classes
    // Looks for classes with potential modifiers and inheritance
    const classRegex = /(?:abstract\s+|final\s+|sealed\s+|base\s+|interface\s+)*class\s+(\w+)(?:\s+(?:extends|with|implements)[\s\w,<>]+)?\s*\{/g;

    let match;
    let processedCount = 0;
    
    // Process in chunks to keep UI responsive
    while ((match = classRegex.exec(text)) !== null) {
        if (token?.isCancellationRequested) {return;}
        
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
        
        // Periodically report progress
        processedCount++;
        if (processedCount % 5 === 0) {
            progress?.report({ 
                message: `Found ${processedCount} classes...`, 
                increment: 5 
            });
            // Allow UI to update
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
}

/**
 * Processes constructors for all found classes
 * 
 * @param text The full text of the document
 * @param classNames Array of class names to find constructors for
 * @param document The document to process
 * @param edits Array to store edits
 * @param progress Optional progress reporter
 * @param token Optional cancellation token
 */
async function processConstructorsInDocument(
    text: string,
    classNames: string[],
    document: vscode.TextDocument,
    edits: vscode.TextEdit[],
    progress?: vscode.Progress<{message?: string; increment?: number}>,
    token?: vscode.CancellationToken
): Promise<void> {
    const totalClasses = classNames.length;
    
    for (let i = 0; i < classNames.length; i++) {
        if (token?.isCancellationRequested) {return;}
        
        const className = classNames[i];
        // Find all constructors using the enhanced method
        await findConstructors(text, className, document, edits);
        
        // Update progress
        if (totalClasses > 0) {
            progress?.report({
                message: `Processing constructors (${i+1}/${totalClasses})...`,
                increment: 20 / totalClasses
            });
            
            // Allow UI to update on large files
            if (i % 3 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
    }
}



