export interface RenderTime {
    start?: Date,
    end?: Date, 
    difference?: {
        seconds: number, 
        minutes: number, 
        hours: number
    }
}