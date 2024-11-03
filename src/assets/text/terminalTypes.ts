export interface LoadLine {
    text: string, 
    loadType: LoadTypes, 
    loadTime?: number, 
    stuck?: boolean
}

export enum LoadTypes {
    None = "none",
    Spinner = "spinner",
    Percentage = "percentage",
    Error = "error"
}

export interface LoadSequence {
    content: LoadLine[]
}

export interface Speech {
    content: string[]
}