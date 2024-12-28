import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import assert from 'assert';
import { generateClass, readTemplateJson } from '../utils/json';

suite('readTemplateJson', () => {
    const mockWorkspaceFolder = {
        uri: { fsPath: '/mockWorkspace' },
    };

    setup(() => {
        Object.defineProperty(vscode.workspace, 'workspaceFolders', {
            value: [mockWorkspaceFolder],
            writable: false,
        });
    });

    test('should handle errors gracefully and show error message', async () => {
        const mockConfig = 'config.json';
        fs.promises.readFile = async () => {
            throw new Error('File not found');
        };

        vscode.window.showErrorMessage = async (message: string) => {
            if (message === `Error reading the file: ${mockConfig}`) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Unexpected error message'));
        };

        const result = await readTemplateJson(mockConfig);

        assert.strictEqual(result, undefined);
    });
});

suite('generateClass', () => {
    test('should generate a class with imports and class body', () => {
        const template = {
            imports: ['import A from "moduleA";', 'import B from "moduleB";'],
            classStructure: ['class {className} {', '  constructor() {}', '}'],
        };
        const className = 'TestClass';

        const result = generateClass(template, className);

        assert.strictEqual(
            result,
            'import A from "moduleA";\nimport B from "moduleB";\n\nclass TestClass {\n  constructor() {}\n}\n'
        );
    });

    test('should generate a class without imports if none are provided', () => {
        const template = {
            imports: [],
            classStructure: ['class {className} {', '  constructor() {}', '}'],
        };
        const className = 'TestClass';

        const result = generateClass(template, className);

        assert.strictEqual(result, 'class TestClass {\n  constructor() {}\n}\n');
    });
});
