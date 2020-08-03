import * as JSONDiffPatch from 'jsondiffpatch';
/**
 * @description
 * Returns the changed value of the object.
 *
 * @param left any
 * @param right any
 */
export declare const diff: (left: any, right: any) => JSONDiffPatch.Delta | undefined;
/**
 * @description
 * Returns the changed values of the object.
 *
 * @param object any
 */
export declare const diffs: (object: any[]) => JSONDiffPatch.Delta[];
export interface IChangeLogs {
    op: 'add' | 'remove' | 'replace' | 'move';
    path: string;
    value: any;
}
/**
 * @description
 * Returns the changed content in
 * JSON PATCH (RFC 6902) format.
 *
 * @param diff
 * @param original any
 * @returns It returns JSON PATCH (RFC 6902)
 */
export declare const changelogs: (diff: JSONDiffPatch.Delta, original: any) => IChangeLogs[] | undefined;
export interface IChangelogsFormattedOption {
    diff: JSONDiffPatch.Delta;
    original: any;
    format: 'console' | 'annotated' | 'html';
}
/**
 * @description
 * Returns the changed content in
 * human readable log form.
 *
 * @param option
 * @returns string
 */
export declare const changelogsFormatted: (option: IChangelogsFormattedOption) => string | undefined;
/**
 * @description
 * Applies changes to objects.
 *
 * @param left any
 * @param diff
 */
export declare const patch: (left: any, diff: JSONDiffPatch.Delta) => any;
/**
 * @description
 * Applies multiple changes to objects.
 *
 * @param left any
 * @param diffs
 */
export declare const patches: (object: any, diffs: JSONDiffPatch.Delta[]) => any;
/**
 * @description
 * Exclude changes from objects.
 *
 * @param right any
 * @param diff
 */
export declare const unpatch: (right: any, diff: JSONDiffPatch.Delta) => any;
/**
 * @description
 * Exclude multiple changes from objects.
 *
 * @param right any
 * @param diff
 */
export declare const unpatches: (object: any, diffs: JSONDiffPatch.Delta[]) => any;
/**
 * @description
 * Reverse the diff order.
 *
 * @param diff
 */
export declare const reverse: (diff: JSONDiffPatch.Delta) => JSONDiffPatch.Delta | undefined;
