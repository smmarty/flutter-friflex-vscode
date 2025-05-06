import * as vscode from 'vscode';

/**
 * Checks if a string is a class constructor
 * 
 * @param {string} line - Line to check
 * @param {string} className - Class name
 * @returns {boolean} - true if the line is a constructor
 */
export function isConstructor(line: string, className: string): boolean {
    // Pattern for constructor detection
    // - can start with "const", "factory" or nothing
    // - followed by the class name
    // - possible modifiers (.named etc.)
    // - parentheses with parameters
    // - can end with {, => or ;
    const constructorPattern = new RegExp(`^\\s*(?:const\\s+|factory\\s+)?${className}(?:\\.\\w+)?\\s*\\(.*\\)(?:\\s*:\\s*.*)?(?:\\s*\\{|\\s*=>|\\s*;)?`);
    return constructorPattern.test(line);
}

/**
 * Finds class constructors in text and adds comments to them
 * 
 * @param {string} text - Document text
 * @param {string} className - Class name
 * @param {vscode.TextDocument} document - Document
 * @param {vscode.TextEdit[]} edits - Array to store edits
 * @returns {Promise<void>}
 */
export async function findConstructors(text: string, className: string, document: vscode.TextDocument, edits: vscode.TextEdit[]): Promise<void> {
    // Find all occurrences of the class name
    const lines = text.split('\n');
    const linesCount = lines.length;
    
    // Process in chunks to prevent UI blocking
    for (let i = 0; i < linesCount; i++) {
        const line = lines[i].trim();

        // Check if this is a constructor
        if (isConstructor(line, className)) {
            // Check for existing comments
            let hasComments = false;
            for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
                const prevLine = lines[j].trim();
                if (prevLine.startsWith('///') || prevLine.startsWith('/**')) {
                    hasComments = true;
                    break;
                }
                // If we encounter a non-empty line that's not a comment, exit
                if (prevLine !== '') {
                    break;
                }
            }

            // If no comments exist, add them
            if (!hasComments) {
                // Create comment using {@macro}
                const constructorComment = `  /// {@macro ${className}}\n`;

                // Insert comment into document
                const insertPosition = new vscode.Position(i, 0);
                edits.push(vscode.TextEdit.insert(insertPosition, constructorComment));
            }
        }
        
        // Periodically yield control to the main thread
        // to prevent UI blocking on large files
        if (i % 500 === 0 && i > 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
}