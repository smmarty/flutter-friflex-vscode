import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { configFolderName } from '../consts';

export function createFolderIfNotExists(folderPath: string): void {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

export function createSubfolders(basePath: string, subFolders: string[]): void {
    subFolders.forEach(sub => {
        const subFolderPath = path.join(basePath, sub);
        createFolderIfNotExists(subFolderPath);
    });
}

export function createFileIfNotExists(filePath: string, content: string): void {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    }
}

export interface FolderStructure {
    folders: string[];
    files: { path: string; content?: string; template?: string }[];
}


export function copyFileSync(from: string, to: string): void {
    const toDir = path.dirname(to);
    if (!fs.existsSync(toDir)) {
        fs.mkdirSync(toDir, { recursive: true });
    }
    fs.copyFileSync(from, to);
}

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

export function convertPathToPascalCase(filePath: string): string {
    const pathSegments = filePath.split(/[\\/]/);
    let fileName = pathSegments[pathSegments.length - 1];
    fileName = fileName.replace(/\.[^/.]+$/, '');
    return fileName
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
}
