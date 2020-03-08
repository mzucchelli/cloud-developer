import { FileStorage } from '../fileStorage/fileStorage'

const fileStorage = new FileStorage()

export function generateUploadUrl(todoId: string) {
    return fileStorage.generateUploadUrl(todoId)
}
