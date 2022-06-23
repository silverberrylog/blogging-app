// export interface Comment {
//     id: string
//     postedBy: string // just a name that the user chooses
//     replyingTo?: string // comment id or null
//     content: string
//     createdAt: number
// }

export interface Post {
    id: string
    name: string
    content: string
    createdAt: number
}
