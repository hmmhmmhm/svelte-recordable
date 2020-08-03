import * as _JSONDiffPatch from 'jsondiffpatch'

export interface IJSONDiffPatchOption {
    objectHash?: (obj: any) => any
    arrays: {
        detectMove: boolean
        includeValueOnMove: boolean
    }
    textDiff: {
        minLength: number
    }
    propertyFilter: (name: any, context: any) => boolean
    cloneDiffValues: boolean
}

export const defaultOption = {
    arrays: {
        detectMove: true,
        includeValueOnMove: false,
    },
    textDiff: {
        minLength: 1,
    },
    propertyFilter: (name, context) => {
        return name.slice(0, 1) !== '$'
    },
    cloneDiffValues: false,
}

export const create = (option: IJSONDiffPatchOption) => {
    return _JSONDiffPatch.create(option)
}

export const CustomizedDiffPatch = create(defaultOption)
