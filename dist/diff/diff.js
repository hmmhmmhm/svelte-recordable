"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var _JSONDiffPatch = __importStar(require("jsondiffpatch"));
exports.defaultOption = {
    arrays: {
        detectMove: true,
        includeValueOnMove: false
    },
    textDiff: {
        minLength: 1
    },
    propertyFilter: function (name, context) {
        return name.slice(0, 1) !== '$';
    },
    cloneDiffValues: false
};
exports.create = function (option) {
    return _JSONDiffPatch.create(option);
};
exports.CustomizedDiffPatch = exports.create(exports.defaultOption);
