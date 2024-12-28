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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const assert_1 = __importDefault(require("assert"));
const json_1 = require("../utils/json");
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
        vscode.window.showErrorMessage = async (message) => {
            if (message === `Error reading the file: ${mockConfig}`) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Unexpected error message'));
        };
        const result = await (0, json_1.readTemplateJson)(mockConfig);
        assert_1.default.strictEqual(result, undefined);
    });
});
suite('generateClass', () => {
    test('should generate a class with imports and class body', () => {
        const template = {
            imports: ['import A from "moduleA";', 'import B from "moduleB";'],
            classStructure: ['class {className} {', '  constructor() {}', '}'],
        };
        const className = 'TestClass';
        const result = (0, json_1.generateClass)(template, className);
        assert_1.default.strictEqual(result, 'import A from "moduleA";\nimport B from "moduleB";\n\nclass TestClass {\n  constructor() {}\n}\n');
    });
    test('should generate a class without imports if none are provided', () => {
        const template = {
            imports: [],
            classStructure: ['class {className} {', '  constructor() {}', '}'],
        };
        const className = 'TestClass';
        const result = (0, json_1.generateClass)(template, className);
        assert_1.default.strictEqual(result, 'class TestClass {\n  constructor() {}\n}\n');
    });
});
//# sourceMappingURL=json.test.js.map