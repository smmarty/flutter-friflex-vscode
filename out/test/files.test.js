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
const assert = __importStar(require("assert"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const files_1 = require("../utils/files");
suite('Files Utility Test Suite', () => {
    test('createFolderIfNotExists creates folder if it does not exist', () => {
        const folderPath = path.join(__dirname, 'testFolder');
        if (fs.existsSync(folderPath)) {
            fs.rmdirSync(folderPath, { recursive: true });
        }
        (0, files_1.createFolderIfNotExists)(folderPath);
        assert.strictEqual(fs.existsSync(folderPath), true);
        fs.rmdirSync(folderPath, { recursive: true });
    });
    test('createSubfolders creates subfolders correctly', () => {
        const basePath = path.join(__dirname, 'baseFolder');
        const subFolders = ['sub1', 'sub2'];
        if (fs.existsSync(basePath)) {
            fs.rmdirSync(basePath, { recursive: true });
        }
        (0, files_1.createSubfolders)(basePath, subFolders);
        subFolders.forEach(sub => {
            assert.strictEqual(fs.existsSync(path.join(basePath, sub)), true);
        });
        fs.rmdirSync(basePath, { recursive: true });
    });
    test('createFileIfNotExists creates file with content if it does not exist', () => {
        const filePath = path.join(__dirname, 'testFile.txt');
        const content = 'Hello, world!';
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        (0, files_1.createFileIfNotExists)(filePath, content);
        assert.strictEqual(fs.existsSync(filePath), true);
        assert.strictEqual(fs.readFileSync(filePath, 'utf8'), content);
        fs.unlinkSync(filePath);
    });
    test('copyFileSync copies file from one location to another', () => {
        const from = path.join(__dirname, 'fromFile.txt');
        const to = path.join(__dirname, 'toFile.txt');
        fs.writeFileSync(from, 'Hello, world!', { encoding: 'utf8' });
        if (fs.existsSync(to)) {
            fs.unlinkSync(to);
        }
        (0, files_1.copyFileSync)(from, to);
        assert.strictEqual(fs.existsSync(to), true);
        assert.strictEqual(fs.readFileSync(to, 'utf8'), 'Hello, world!');
        fs.unlinkSync(from);
        fs.unlinkSync(to);
    });
    test('convertPathToPascalCase converts file path to PascalCase correctly', () => {
        const filePath = 'some_path/to_file.txt';
        const expected = 'ToFile';
        const result = (0, files_1.convertPathToPascalCase)(filePath);
        assert.strictEqual(result, expected);
    });
});
//# sourceMappingURL=files.test.js.map