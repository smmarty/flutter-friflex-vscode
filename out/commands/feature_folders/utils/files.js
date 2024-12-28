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
exports.createStructureFromJson = createStructureFromJson;
exports.checkAvailableConfig = checkAvailableConfig;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const string_1 = require("./string");
const conts_1 = require("../../../conts");
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
function createStructureFromJson(jsonPath, basePath, featureName) {
    const data = fs.readFileSync(jsonPath, 'utf8');
    const structure = JSON.parse(data);
    const pascalCaseFeatureName = (0, string_1.toPascalCase)(featureName);
    const snakeCaseFeatureName = (0, string_1.toSnakeCase)(featureName);
    try {
        structure.folders.forEach(folder => {
            const folderPath = path.join(basePath, folder);
            createFolderIfNotExists(folderPath);
        });
    }
    catch (error) {
        console.log(error);
    }
    try {
        structure.files.forEach(file => {
            const filePath = path.join(basePath, file.path.replace(/{feature_name}/g, snakeCaseFeatureName));
            let content = file.content || '';
            if (file.template) {
                content = file.template
                    .replace(/{feature_name}/g, snakeCaseFeatureName)
                    .replace(/{FeatureName}/g, pascalCaseFeatureName);
            }
            createFileIfNotExists(filePath, content);
        });
    }
    catch (error) {
        console.log(error);
    }
}
function checkAvailableConfig(config, dirname) {
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
    const projectJsonPath = path.join(rootPath, conts_1.folderConfigName, `${config}.json`);
    const jsonPath = path.join(dirname, `../../../${conts_1.folderConfigName}/${config}.json`);
    const featureJsonPath = fs.existsSync(projectJsonPath) ? projectJsonPath : jsonPath;
    return featureJsonPath;
}
//# sourceMappingURL=files.js.map