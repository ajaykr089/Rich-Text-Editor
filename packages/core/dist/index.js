"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPluginManager = exports.PluginManager = exports.Plugin = exports.defaultSanitizer = exports.createSanitizer = exports.ContentValidator = exports.Sanitizer = exports.defaultSchema = exports.Schema = exports.Fragment = exports.MarkType = exports.Mark = exports.NodeType = exports.Node = exports.Slice = exports.ResolvedPos = exports.NodeSelection = exports.TextSelection = exports.Selection = exports.createCommandManager = exports.CommandManager = exports.Editor = exports.ReplaceStep = exports.RemoveMarkStep = exports.AddMarkStep = exports.Transaction = exports.EditorState = void 0;
// Core editor classes
var EditorState_1 = require("./EditorState");
Object.defineProperty(exports, "EditorState", { enumerable: true, get: function () { return EditorState_1.EditorState; } });
Object.defineProperty(exports, "Transaction", { enumerable: true, get: function () { return EditorState_1.Transaction; } });
Object.defineProperty(exports, "AddMarkStep", { enumerable: true, get: function () { return EditorState_1.AddMarkStep; } });
Object.defineProperty(exports, "RemoveMarkStep", { enumerable: true, get: function () { return EditorState_1.RemoveMarkStep; } });
Object.defineProperty(exports, "ReplaceStep", { enumerable: true, get: function () { return EditorState_1.ReplaceStep; } });
// Main Editor class
var Editor_1 = require("./Editor");
Object.defineProperty(exports, "Editor", { enumerable: true, get: function () { return Editor_1.Editor; } });
// Command system
var CommandManager_1 = require("./commands/CommandManager");
Object.defineProperty(exports, "CommandManager", { enumerable: true, get: function () { return CommandManager_1.CommandManager; } });
Object.defineProperty(exports, "createCommandManager", { enumerable: true, get: function () { return CommandManager_1.createCommandManager; } });
// Selection system
var Selection_1 = require("./Selection");
Object.defineProperty(exports, "Selection", { enumerable: true, get: function () { return Selection_1.Selection; } });
Object.defineProperty(exports, "TextSelection", { enumerable: true, get: function () { return Selection_1.TextSelection; } });
Object.defineProperty(exports, "NodeSelection", { enumerable: true, get: function () { return Selection_1.NodeSelection; } });
Object.defineProperty(exports, "ResolvedPos", { enumerable: true, get: function () { return Selection_1.ResolvedPos; } });
Object.defineProperty(exports, "Slice", { enumerable: true, get: function () { return Selection_1.Slice; } });
// Document model
var Node_1 = require("./model/Node");
Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return Node_1.Node; } });
Object.defineProperty(exports, "NodeType", { enumerable: true, get: function () { return Node_1.NodeType; } });
var Mark_1 = require("./model/Mark");
Object.defineProperty(exports, "Mark", { enumerable: true, get: function () { return Mark_1.Mark; } });
Object.defineProperty(exports, "MarkType", { enumerable: true, get: function () { return Mark_1.MarkType; } });
var Fragment_1 = require("./model/Fragment");
Object.defineProperty(exports, "Fragment", { enumerable: true, get: function () { return Fragment_1.Fragment; } });
// Schema system
var Schema_1 = require("./schema/Schema");
Object.defineProperty(exports, "Schema", { enumerable: true, get: function () { return Schema_1.Schema; } });
Object.defineProperty(exports, "defaultSchema", { enumerable: true, get: function () { return Schema_1.defaultSchema; } });
// Security
var Sanitizer_1 = require("./security/Sanitizer");
Object.defineProperty(exports, "Sanitizer", { enumerable: true, get: function () { return Sanitizer_1.Sanitizer; } });
Object.defineProperty(exports, "ContentValidator", { enumerable: true, get: function () { return Sanitizer_1.ContentValidator; } });
Object.defineProperty(exports, "createSanitizer", { enumerable: true, get: function () { return Sanitizer_1.createSanitizer; } });
Object.defineProperty(exports, "defaultSanitizer", { enumerable: true, get: function () { return Sanitizer_1.defaultSanitizer; } });
// Plugins
var Plugin_1 = require("./plugins/Plugin");
Object.defineProperty(exports, "Plugin", { enumerable: true, get: function () { return Plugin_1.Plugin; } });
var PluginManager_1 = require("./plugins/PluginManager");
Object.defineProperty(exports, "PluginManager", { enumerable: true, get: function () { return PluginManager_1.PluginManager; } });
Object.defineProperty(exports, "createPluginManager", { enumerable: true, get: function () { return PluginManager_1.createPluginManager; } });
