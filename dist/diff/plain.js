"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var JSONDiffPatch = __importStar(require("jsondiffpatch"));
var diff_1 = require("./diff");
/**
 * @description
 * Returns the changed value of the object.
 *
 * @param left any
 * @param right any
 */
exports.diff = function (left, right) {
    return diff_1.CustomizedDiffPatch.diff(left, right);
};
/**
 * @description
 * Returns the changed values of the object.
 *
 * @param object any
 */
exports.diffs = function (object) {
    var diffs = [];
    for (var i = 0; i < object.length - 1; i++) {
        var left = object[i];
        var right = object[i + 1];
        var diffObject = diff_1.CustomizedDiffPatch.diff(left, right);
        if (diffObject)
            diffs.push(diffObject);
    }
    return diffs;
};
/**
 * @description
 * Returns the changed content in
 * JSON PATCH (RFC 6902) format.
 *
 * @param diff
 * @param original any
 * @returns It returns JSON PATCH (RFC 6902)
 */
exports.changelogs = function (diff, original) {
    try {
        // @ts-ignore
        var result = JSONDiffPatch.formatters.jsonpatch.format(diff, original);
        if (!result)
            throw new Error();
        return result;
    }
    catch (e) {
        return undefined;
    }
};
/**
 * @description
 * Returns the changed content in
 * human readable log form.
 *
 * @param option
 * @returns string
 */
exports.changelogsFormatted = function (option) {
    var result = undefined;
    try {
        switch (option.format) {
            case 'annotated':
                result = JSONDiffPatch.formatters.annotated.format(option.diff, option.original);
                break;
            case 'console':
                result = JSONDiffPatch.formatters.console.format(option.diff, option.original);
                break;
            case 'html':
                result = JSONDiffPatch.formatters.html.format(option.diff, option.original);
                break;
        }
    }
    catch (e) { }
    return result;
};
/**
 * @description
 * Applies changes to objects.
 *
 * @param left any
 * @param diff
 */
exports.patch = function (left, diff) {
    return diff_1.CustomizedDiffPatch.patch(left, diff);
};
/**
 * @description
 * Applies multiple changes to objects.
 *
 * @param left any
 * @param diffs
 */
exports.patches = function (object, diffs) {
    var patched = object;
    try {
        for (var _i = 0, diffs_1 = diffs; _i < diffs_1.length; _i++) {
            var diff_2 = diffs_1[_i];
            patched = diff_1.CustomizedDiffPatch.patch(patched, diff_2);
        }
    }
    catch (e) {
        return undefined;
    }
    return patched;
};
/**
 * @description
 * Exclude changes from objects.
 *
 * @param right any
 * @param diff
 */
exports.unpatch = function (right, diff) {
    return diff_1.CustomizedDiffPatch.unpatch(right, diff);
};
/**
 * @description
 * Exclude multiple changes from objects.
 *
 * @param right any
 * @param diff
 */
exports.unpatches = function (object, diffs) {
    var patched = undefined;
    try {
        for (var _i = 0, diffs_2 = diffs; _i < diffs_2.length; _i++) {
            var diff_3 = diffs_2[_i];
            patched = diff_1.CustomizedDiffPatch.unpatch(patched, diff_3);
        }
    }
    catch (e) {
        return undefined;
    }
    return patched;
};
/**
 * @description
 * Reverse the diff order.
 *
 * @param diff
 */
exports.reverse = function (diff) {
    return diff_1.CustomizedDiffPatch.reverse(diff);
};
