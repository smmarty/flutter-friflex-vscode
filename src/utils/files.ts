import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { configFolderName } from '../consts';
/** 
 * Global utility functions
*/

/**
 * Creates the folder if it does not exist.
 * @param {string} folderPath - A path to the folder to be created.
 */
export function createFolderIfNotExists(folderPath: string): void {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

/**
 * Creates subfolders in the specified base path if they do not exist.
 * @param {string} basePath - The base path for the subfolders.
 * @param {string[]} subFolders - The names of the subfolders to be created.
 */
export function createSubfolders(basePath: string, subFolders: string[]): void {
    subFolders.forEach(sub => {
        const subFolderPath = path.join(basePath, sub);
        createFolderIfNotExists(subFolderPath);
    });
}

/**
 * Creates a file with the specified content if it does not exist.
 * 
 * @param {string} filePath - The path to the file to be created.
 * @param {string} content - The content to write into the file if it does not exist.
 */

export function createFileIfNotExists(filePath: string, content: string): void {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    }
}

/// Interface for folder structure
export interface FolderStructure {
    folders: string[];
    files: { path: string; content?: string; template?: string }[];
}


/**
 * Copies the file from one location to another if the destination path does not exist.
 * Creates the destination folder if it does not exist.
 * @param {string} from - The path to the file to be copied.
 * @param {string} to - The path to the destination file.
 */
export function copyFileSync(from: string, to: string): void {
    const toDir = path.dirname(to);
    if (!fs.existsSync(toDir)) {
        fs.mkdirSync(toDir, { recursive: true });
    }
    fs.copyFileSync(from, to);
}

/**
 * Checks if the configuration file exists in the project's root and copies it
 * from the default location if it does not exist.
 * @param {string} dirName - The path to the directory with the default configuration.
 * @param {string} config - The name of the configuration file.
 */
export function checkAvailableConfigInFolder(dirName: string, config: string) {
    try {
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
        const currentConfig = path.join(rootPath, `${configFolderName}/${config}`);
        if (!fs.existsSync(currentConfig)) {
            const defaultConfigPath = path.join(dirName, `../../../${configFolderName}/${config}`);
            copyFileSync(defaultConfigPath, currentConfig);
        }
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(`Error reading the file: ${config}`);
    }

}

/**
 * Converts the last segment of a file path to PascalCase.
 * @param {string} filePath - The file path to convert.
 * @returns {string} The PascalCase version of the file name.
 */
export function convertPathToPascalCase(filePath: string): string {
    const pathSegments = filePath.split(/[\\/]/);
    let fileName = pathSegments[pathSegments.length - 1];
    fileName = fileName.replace(/\.[^/.]+$/, '');
    return fileName
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
}
