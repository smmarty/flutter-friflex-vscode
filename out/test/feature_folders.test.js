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
const assert_1 = __importDefault(require("assert"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sinon = __importStar(require("sinon"));
const vscode = __importStar(require("vscode"));
const feature_folders_1 = require("../commands/feature_folders/feature_folders");
suite('registerCreateFeatureFoldersCommand', () => {
    let context;
    let readFileSyncStub;
    let createFolderStub;
    let createFileStub;
    let showInputBoxStub;
    let showErrorMessageStub;
    setup(() => {
        context = { subscriptions: [] };
        sinon.stub(vscode.commands, 'registerCommand').callsFake((command, callback) => {
            context.subscriptions.push({ command, callback });
            return { dispose: () => { } };
        });
        showInputBoxStub = sinon.stub(vscode.window, 'showInputBox').resolves('featureName');
        showErrorMessageStub = sinon.stub(vscode.window, 'showErrorMessage');
        readFileSyncStub = sinon.stub(fs, 'readFileSync').returns('{ "folders": ["folder1"], "files": [{ "path": "{file_name}.ts", "content": "", "template": "export class {class_name} {}" }] }');
        createFolderStub = sinon.stub(require('../../utils/files'), 'createFolderIfNotExists');
        createFileStub = sinon.stub(require('../../utils/files'), 'createFileIfNotExists');
    });
    const registeredCommand = context.subscriptions.find(sub => sub.command === 'extension.createFeatureFolders');
    sinon.restore();
    // Reset stubs after each test
    afterEach(() => {
        showInputBoxStub?.restore();
        showErrorMessageStub?.restore();
        readFileSyncStub?.restore();
        createFolderStub?.restore();
        createFileStub?.restore();
    });
});
test('should register the command', () => {
    (0, feature_folders_1.registerCreateFeatureFoldersCommand)(context);
    const registeredCommand = context.subscriptions.find(sub => sub.command === 'extension.createFeatureFolders');
    assert_1.default.ok(registeredCommand, 'Command was not registered');
});
test('should prompt the user for a feature name and create folders and files', async () => {
    const mockUri = { fsPath: '/mock/path' };
    (0, feature_folders_1.registerCreateFeatureFoldersCommand)(context);
    const registeredCommand = context.subscriptions.find(sub => sub.command === 'extension.createFeatureFolders');
    if (!registeredCommand || typeof registeredCommand.callback !== 'function') {
        throw new Error('Command not found');
    }
    await registeredCommand.callback(mockUri);
    assert_1.default.ok(createFolderStub.calledWith(path.join('/mock/path', 'feature_name', 'folder1')), 'Folder was not created');
    assert_1.default.ok(createFileStub.calledWith(path.join('/mock/path', 'feature_name', 'feature_name.ts'), 'export class FeatureName {}'), 'File was not created');
});
test('should show an error message if no feature name is provided', async () => {
    showInputBoxStub.resolves('');
    const mockUri = { fsPath: '/mock/path' };
    (0, feature_folders_1.registerCreateFeatureFoldersCommand)(context);
    const registeredCommand = context.subscriptions.find(sub => sub.command === 'extension.createFeatureFolders');
    if (!registeredCommand || typeof registeredCommand.callback !== 'function') {
        throw new Error('Command not found');
    }
    await registeredCommand.callback(mockUri);
    assert_1.default.ok(showErrorMessageStub.calledWith('You must enter the module name'), 'Error message was not shown');
});
test('should handle errors during folder creation gracefully', async () => {
    createFolderStub.throws(new Error('Folder creation failed'));
    const mockUri = { fsPath: '/mock/path' };
    (0, feature_folders_1.registerCreateFeatureFoldersCommand)(context);
    const registeredCommand = context.subscriptions.find(sub => sub.command === 'extension.createFeatureFolders');
    if (!registeredCommand || typeof registeredCommand.callback !== 'function') {
        throw new Error('Command not found');
    }
    await registeredCommand.callback(mockUri);
    assert_1.default.ok(showErrorMessageStub.calledWith('Error when creating folders: Error: Folder creation failed'), 'Error during folder creation was not handled');
});
test('should handle errors during file creation gracefully', async () => {
    createFileStub.throws(new Error('File creation failed'));
    const mockUri = { fsPath: '/mock/path' };
    (0, feature_folders_1.registerCreateFeatureFoldersCommand)(context);
    const registeredCommand = context.subscriptions.find(sub => sub.command === 'extension.createFeatureFolders');
    if (!registeredCommand || typeof registeredCommand.callback !== 'function') {
        throw new Error('Command not found');
    }
    await registeredCommand.callback(mockUri);
    assert_1.default.ok(showErrorMessageStub.calledWith('Error when creating files: Error: File creation failed'), 'Error during file creation was not handled');
});
;
//# sourceMappingURL=feature_folders.test.js.map