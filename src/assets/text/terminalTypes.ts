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

interface TextBlock {
    prompt?: {
        [answer: string]: string;
    }
    collect?: boolean;
}

export interface LoadSequence extends TextBlock {
    content: LoadLine[]
}

export interface Speech extends TextBlock {
    content: string[]
}