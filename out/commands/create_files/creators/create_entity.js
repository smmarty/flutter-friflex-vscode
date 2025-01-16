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
/**
 * Registers the 'Create Entity' command in VS Code.
 *
 * Checks the configuration settings to determine whether to generate an entity
 * with equatable or not. If the setting is enabled, it uses the
 * `configEntityWithEquatable.json` configuration. Otherwise, it uses the
 * `configEntity.json` configuration.
 *
 * Copies the content of the configuration file to the `friflex_config` folder in
 * the project root if it does not exist.
 *
 * Gets the content of the configuration file and the name of the current file
 * in the active text editor. Replaces placeholders in the configuration file
 * with the actual file name in PascalCase. Inserts the generated code into the
 * active text editor at the beginning of the file.
 * @param {string} dirName - The path to the directory with the default configuration.
 */
// This function is responsible for creating an entity in the specified directory.
// It checks the configuration for whether the entity should use the "Equatable" package
// and generates code based on a template, inserting it into the currently active editor.
const createEntity = async (dirName) => {
    // Check if the "Equatable" feature is enabled for the entity.
    const isEntityWithEquatable = vscode.workspace.getConfiguration().get(consts_1.settingsEntityWithEquatable, true);
    // If Equatable is enabled, check for the availability of the corresponding configuration.
    if (isEntityWithEquatable) {
        (0, files_1.checkAvailableConfigInFolder)(dirName, consts_1.configEntityWithEquatable);
    }
    else {
        // Otherwise, check the standard configuration.
        (0, files_1.checkAvailableConfigInFolder)(dirName, consts_1.configEntity);
    }
    // Determine which configuration to use.
    const currentConfig = isEntityWithEquatable ? consts_1.configEntityWithEquatable : consts_1.configEntity;
    // Get the active text editor.
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        // Exit the function if no editor is active.
        return;
    }
    // Get the file path of the current document.
    const filePath = editor.document.fileName;
    // Read the JSON template for code generation.
    const template = await (0, json_1.readTemplateJson)(currentConfig);
    // Extract the file name from the file path.
    const fileName = filePath.split('/').pop() ?? '';
    // Convert the file name to a class name (PascalCase).
    const className = fileName.replace('.dart', '');
    const normalizedClassName = (0, files_1.convertPathToPascalCase)(className);
    // Generate class code based on the template.
    const generatedCode = (0, json_1.generateClass)(template, normalizedClassName);
    // Define the position to insert the code (start of the file).
    const firstLine = new vscode.Position(0, 0);
    // Insert the generated code into the editor.
    editor.edit(editBuilder => {
        editBuilder.insert(firstLine, generatedCode);
    });
};
exports.createEntity = createEntity;
//# sourceMappingURL=create_entity.js.map