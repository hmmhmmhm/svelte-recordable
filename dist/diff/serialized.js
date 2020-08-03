"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var cbor_1 = __importDefault(require("cbor"));
var PlainOperational = __importStar(require("./plain"));
var diff_1 = require("./diff");
/**
 * @description
 * Returns the changed value of the object.
 *
 * @param left any
 * @param right any
 */
exports.diff = function (left, right) {
    var _diff = PlainOperational.diff(left, right);
    if (!_diff)
        return _diff;
    try {
        var cborEncoded = cbor_1["default"].encode(_diff);
        var compressed = cborEncoded.toString('base64');
        if (!compressed)
            throw new Error();
        return compressed;
    }
    catch (e) {
        return undefined;
    }
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
        var diffObject = exports.diff(left, right);
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
 * @param diff string
 * @param original any
 * @returns It returns JSON PATCH (RFC 6902)
 */
exports.changelogs = function (diff, original) {
    try {
        var _diff = cbor_1["default"].decode(Buffer.from(diff, 'base64'));
        return PlainOperational.changelogs(_diff, original);
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
    try {
        var diff_2 = cbor_1["default"].decode(Buffer.from(option.diff, 'base64'));
        return PlainOperational.changelogsFormatted({
            diff: diff_2,
            format: option.format,
            original: option.original
        });
    }
    catch (e) {
        return undefined;
    }
};
/**
 * @description
 * Applies changes to objects.
 *
 * @param left any
 * @param diff string
 */
exports.patch = function (left, diff) {
    try {
        var _diff = cbor_1["default"].decode(Buffer.from(diff, 'base64'));
        return diff_1.CustomizedDiffPatch.patch(left, _diff);
    }
    catch (e) {
        return undefined;
    }
};
/**
 * @description
 * Applies multiple changes to objects.
 *
 * @param left any
 * @param diffs string[]
 */
exports.patches = function (object, diffs) {
    var patched = object;
    try {
        for (var _i = 0, diffs_1 = diffs; _i < diffs_1.length; _i++) {
            var diff_3 = diffs_1[_i];
            var _diff = cbor_1["default"].decode(Buffer.from(diff_3, 'base64'));
            patched = diff_1.CustomizedDiffPatch.patch(patched, _diff);
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
 * @param diff string
 */
exports.unpatch = function (right, diff) {
    var _diff = cbor_1["default"].decode(Buffer.from(diff, 'base64'));
    return diff_1.CustomizedDiffPatch.unpatch(right, _diff);
};
/**
 * @description
 * Exclude multiple changes from objects.
 *
 * @param right any
 * @param diffs string
 */
exports.unpatches = function (object, diffs) {
    var patched = undefined;
    try {
        for (var _i = 0, diffs_2 = diffs; _i < diffs_2.length; _i++) {
            var diff_4 = diffs_2[_i];
            var _diff = cbor_1["default"].decode(Buffer.from(diff_4, 'base64'));
            patched = diff_1.CustomizedDiffPatch.unpatch(patched, _diff);
        }
    }
    catch (e) { }
    return patched;
};
/**
 * @description
 * Reverse the diff order.
 *
 * @param diff string
 */
exports.reverse = function (diff) {
    try {
        var _diff = cbor_1["default"].decode(Buffer.from(diff, 'base64'));
        return diff_1.CustomizedDiffPatch.reverse(_diff);
    }
    catch (e) {
        return undefined;
    }
};
exports.decodeDiff = function (diff) {
    try {
        var decoded = cbor_1["default"].decode(Buffer.from(diff, 'base64'));
        if (!decoded)
            throw new Error();
        return decoded;
    }
    catch (e) {
        return undefined;
    }
};
exports.decodeDiffs = function (diffs) {
    var decodedDiffs = [];
    try {
        for (var _i = 0, diffs_3 = diffs; _i < diffs_3.length; _i++) {
            var diff_5 = diffs_3[_i];
            var decodedDiff = exports.decodeDiff(diff_5);
            if (!decodedDiff)
                throw new Error();
            decodedDiffs.push(decodedDiff);
        }
        return decodedDiffs;
    }
    catch (e) {
        return undefined;
    }
};
exports.encodeDiff = function (diff) {
    try {
        var encoded = cbor_1["default"].encode(diff).toString('base64');
        if (!encoded)
            throw new Error();
        return encoded;
    }
    catch (e) {
        return undefined;
    }
};
exports.encodeDiffs = function (diffs) {
    var encodedDiffs = [];
    try {
        for (var _i = 0, diffs_4 = diffs; _i < diffs_4.length; _i++) {
            var diff_6 = diffs_4[_i];
            var encodedDiff = exports.encodeDiff(diff_6);
            if (!encodedDiff)
                throw new Error();
            encodedDiffs.push(encodedDiff);
        }
        return encodedDiffs;
    }
    catch (e) {
        return undefined;
    }
};
