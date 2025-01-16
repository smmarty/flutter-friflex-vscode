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
exports.readTemplateJson = readTemplateJson;
exports.generateClass = generateClass;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const consts_1 = require("../consts");
/// Global functions for working with json
/**
 * Reads the content of a given JSON file in the `.friflex_config` folder as JSON.
 * @param {string} config - The name of the JSON file.
 * @returns {Promise<any>} The content of the file as JSON.
 * @throws {vscode.MessageItem} An error message if the file does not exist or cannot be read.
 */
async function readTemplateJson(config) {
    try {
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
        const templatePath = path.join(rootPath, `${consts_1.configFolderName}/${config}`);
        const fileContent = await fs.promises.readFile(templatePath, 'utf8');
        return JSON.parse(fileContent);
    }
    catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(`Error reading the file: ${config}`);
    }
}
/**
 * Generates a class based on the given template and className.
 * Replaces `{className}` with the given className in the template.
 * If the template has imports, they are joined with newline and prepended to the class declaration.
 * @param {any} template - The template to generate the class from.
 * @param {string} className - The name of the class to generate.
 * @returns {string} The generated class as a string.
 */
function generateClass(template, className) {
    const importsJoined = template.imports.join('\n');
    const classBody = template.classStructure
        .map((line) => line.replace(/{className}/g, className))
        .join('\n');
    if (importsJoined.length === 0) {
        return `${classBody}\n`;
    }
    else {
        return `${importsJoined}\n\n${classBody}\n`;
    }
}
//# sourceMappingURL=json.js.map