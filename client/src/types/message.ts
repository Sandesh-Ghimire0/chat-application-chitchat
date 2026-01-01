export interface Message {
    id: string,
    userId?: string
    sentTo: string
    content: string
}