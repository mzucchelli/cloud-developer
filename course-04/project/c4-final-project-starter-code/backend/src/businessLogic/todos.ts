import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import * as uuid from 'uuid'

const todoAccess = new TodoAccess()
const bucketName = process.env.IMAGES_S3_BUCKET

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todoAccess.getAllTodos(userId);
}

export async function createTodo(todoReq: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId = uuid.v4()
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

    let item: TodoItem = {
      todoId,
      userId: userId,
      createdAt: new Date().toISOString(),
      attachmentUrl,
      ...todoReq,
      done: false
    };

    return todoAccess.createTodo(item);
}

export async function deleteTodo(todoId: string, userId: string) {
  return todoAccess.deleteTodo(todoId, userId)
}

export async function updateTodo(updatedTodo: UpdateTodoRequest, todoId: string, userId: string) {
  return todoAccess.updateTodo(updatedTodo, todoId, userId)
}
