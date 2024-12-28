"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFolderIfNotExists = createFolderIfNotExists;
exports.createSubfolders = createSubfolders;
exports.createFileIfNotExists = createFileIfNotExists;
exports.copyFileSync = copyFileSync;
exports.checkAvailableConfigInFolder = checkAvailableConfigInFolder;
exports.convertPathToPascalCase = convertPathToPascalCase;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const consts_1 = require("../consts");
function createFolderIfNotExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}
function createSubfolders(basePath, subFolders) {
    subFolders.forEach(sub => {
        const subFolderPath = path.join(basePath, sub);
        createFolderIfNotExists(subFolderPath);
    });
}
function createFileIfNotExists(filePath, content) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    }
}
function copyFileSync(from, to) {
    const toDir = path.dirname(to);
    if (!fs.existsSync(toDir)) {
        fs.mkdirSync(toDir, { recursive: true });
    }
    fs.copyFileSync(from, to);
}
function checkAvailableConfigInFolder(dirName, config) {
    try {
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
        const currentConfig = path.join(rootPath, `${consts_1.configFolderName}/${config}`);
        if (!fs.existsSync(currentConfig)) {
            const defaultConfigPath = path.join(dirName, `../../../${consts_1.configFolderName}/${config}`);
            copyFileSync(defaultConfigPath, currentConfig);
        }
    }
    catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(`Error reading the file: ${config}`);
    }
}
function convertPathToPascalCase(filePath) {
    const pathSegments = filePath.split(/[\\/]/);
    let fileName = pathSegments[pathSegments.length - 1];
    fileName = fileName.replace(/\.[^/.]+$/, '');
    return fileName
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
}
//# sourceMappingURL=files.js.map