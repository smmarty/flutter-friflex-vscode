"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const feature_folders_1 = require("./commands/feature_folders/feature_folders");
const create_files_1 = require("./commands/create_files/create_files");
function activate(context) {
    (0, feature_folders_1.registerCreateFeatureFoldersCommand)(context);
    (0, create_files_1.registerCreateFilesCommands)(context);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map