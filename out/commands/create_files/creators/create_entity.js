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
exports.createEntity = void 0;
const vscode = __importStar(require("vscode"));
const files_1 = require("../../../utils/files");
const consts_1 = require("../../../consts");
const json_1 = require("../../../utils/json");
const createEntity = async (dirName) => {
    const isEntityWithEquatable = vscode.workspace.getConfiguration().get(consts_1.settingsEntityWithEquatable, true);
    if (isEntityWithEquatable) {
        (0, files_1.checkAvailableConfigInFolder)(dirName, consts_1.configEntityWithEquatable);
    }
    else {
        (0, files_1.checkAvailableConfigInFolder)(dirName, consts_1.configEntity);
    }
    const currentConfig = isEntityWithEquatable ? consts_1.configEntityWithEquatable : consts_1.configEntity;
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const filePath = editor.document.fileName;
    const template = await (0, json_1.readTemplateJson)(currentConfig);
    const fileName = filePath.split('/').pop() ?? '';
    const className = fileName.replace('.dart', '');
    const normalizedClassName = (0, files_1.convertPathToPascalCase)(className);
    const generatedCode = (0, json_1.generateClass)(template, normalizedClassName);
    const firstLine = new vscode.Position(0, 0);
    editor.edit(editBuilder => {
        editBuilder.insert(firstLine, generatedCode);
    });
};
exports.createEntity = createEntity;
//# sourceMappingURL=create_entity.js.map