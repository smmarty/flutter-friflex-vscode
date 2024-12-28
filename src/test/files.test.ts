import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import {
    convertPathToPascalCase,
    copyFileSync,
    createFileIfNotExists,
    createFolderIfNotExists,
    createSubfolders
} from '../utils/files';

suite('Files Utility Test Suite', () => {
    test('createFolderIfNotExists creates folder if it does not exist', () => {
        const folderPath = path.join(__dirname, 'testFolder');
        if (fs.existsSync(folderPath)) {
            fs.rmdirSync(folderPath, { recursive: true });
        }
        createFolderIfNotExists(folderPath);
        assert.strictEqual(fs.existsSync(folderPath), true);
        fs.rmdirSync(folderPath, { recursive: true });
    });

    test('createSubfolders creates subfolders correctly', () => {
        const basePath = path.join(__dirname, 'baseFolder');
        const subFolders = ['sub1', 'sub2'];
        if (fs.existsSync(basePath)) {
            fs.rmdirSync(basePath, { recursive: true });
        }
        createSubfolders(basePath, subFolders);
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
        createFileIfNotExists(filePath, content);
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
        copyFileSync(from, to);
        assert.strictEqual(fs.existsSync(to), true);
        assert.strictEqual(fs.readFileSync(to, 'utf8'), 'Hello, world!');
        fs.unlinkSync(from);
        fs.unlinkSync(to);
    });

    test('convertPathToPascalCase converts file path to PascalCase correctly', () => {
        const filePath = 'some_path/to_file.txt';
        const expected = 'ToFile';
        const result = convertPathToPascalCase(filePath);
        assert.strictEqual(result, expected);
    });
});