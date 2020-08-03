"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var Utils = __importStar(require("../utils"));
var writable_1 = require("./writable");
var Readable = /** @class */ (function () {
    function Readable(value, start) {
        if (start === void 0) { start = Utils.noop; }
        this.value = value;
        this.start = start;
        this._store = new writable_1.Writable(this.value, this.start);
    }
    Readable.prototype.get = function () {
        return Utils.getStoreValue(this);
    };
    Readable.prototype.subscribe = function (run, invalidate) {
        return this._store.subscribe(run, invalidate);
    };
    return Readable;
}());
exports.Readable = Readable;
