import { Post } from '@/types/models'
import { addDoc } from 'firebase/firestore/lite'
import { v4 as genUUID } from 'uuid'
import { postsCol } from './db'
import { markdownToJson } from './markdown'

export const createBlog = async (MDcontent: string, name: string) => {
    const parsedMd = markdownToJson(MDcontent)

    const post: Post = {
        id: genUUID(),
        name,
        content: JSON.stringify(parsedMd),
        createdAt: Date.now(),
    }
    await addDoc(postsCol, post)
}
