import * as _JSONDiffPatch from 'jsondiffpatch';
export interface IJSONDiffPatchOption {
    objectHash?: (obj: any) => any;
    arrays: {
        detectMove: boolean;
        includeValueOnMove: boolean;
    };
    textDiff: {
        minLength: number;
    };
    propertyFilter: (name: any, context: any) => boolean;
    cloneDiffValues: boolean;
}
export declare const defaultOption: {
    arrays: {
        detectMove: boolean;
        includeValueOnMove: boolean;
    };
    textDiff: {
        minLength: number;
    };
    propertyFilter: (name: any, context: any) => boolean;
    cloneDiffValues: boolean;
};
export declare const create: (option: IJSONDiffPatchOption) => _JSONDiffPatch.DiffPatcher;
export declare const CustomizedDiffPatch: _JSONDiffPatch.DiffPatcher;
