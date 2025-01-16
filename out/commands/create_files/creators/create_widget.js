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
exports.createWidget = void 0;
const vscode = __importStar(require("vscode"));
const files_1 = require("../../../utils/files");
const json_1 = require("../../../utils/json");
/**
 * This function creates a widget in the specified directory.
 * It validates the availability of a given configuration and generates code
 * based on a template, inserting the result into the active editor.
 *
 * @param {string} dirName - The path to the directory where the widget will be
 * created.
 * @param {string} config - The name of the configuration file in the specified
 * directory.
 */
const createWidget = async (dirName, config) => {
    // Check the availability of the specified configuration in the given folder.
    (0, files_1.checkAvailableConfigInFolder)(dirName, config);
    // Get the active text editor.
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        // If no editor is active, exit the function.
        return;
    }
    // Get the file path of the current document.
    const filePath = editor.document.fileName;
    // Read the JSON template for widget generation.
    const template = await (0, json_1.readTemplateJson)(config);
    // Extract the file name from the file path.
    const fileName = filePath.split('/').pop() ?? '';
    // Convert the file name to a class name (PascalCase).
    const className = fileName.replace('.dart', '');
    const normalizedClassName = (0, files_1.convertPathToPascalCase)(className);
    // Generate widget code based on the template.
    const generatedCode = (0, json_1.generateClass)(template, normalizedClassName);
    // Define the position to insert the generated code (start of the file).
    const firstLine = new vscode.Position(0, 0);
    // Insert the generated code into the active editor.
    editor.edit(editBuilder => {
        editBuilder.insert(firstLine, generatedCode);
    });
};
exports.createWidget = createWidget;
//# sourceMappingURL=create_widget.js.map