import * as AWS from 'aws-sdk'

// when I import like this, I get an error:
// Property 'DocumentClient' does not exist on type 'PatchedAWSClientConstructor<ClientConfiguration, typeof DynamoDB>'
// on the line with new XAWS.DynamoDB.DocumentClient() below
//import * as AWSXRay from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)


export class TodoAccess {
    constructor(
        private readonly logger = createLogger('get-todos'),
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable: string = process.env.TODOS_TABLE,
        private readonly indexName: string = process.env.INDEX_NAME,
    ) { }

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        this.logger.info('getting todo list', { userId })

        const result = await this.docClient
            .query({
                TableName: this.todosTable,
                IndexName: this.indexName,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            }).promise()

        this.logger.info('retrieved todo list', { userId })

        const items = result.Items;
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        this.logger.info('creating new todo', { todoId: todo.todoId })

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        this.logger.info('todo was created', { todoId: todo.todoId })

        return todo
    }

    async deleteTodo(todoId: string, userId: string) {
        this.logger.info('deleting todo', { todoId });

        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        }).promise()

        this.logger.info('deleted todo', { todoId })
    }

    async updateTodo(updatedTodo: UpdateTodoRequest, todoId: string, userId: string) {
        this.logger.info('updating todo', { todoId, userId })

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: "set #name = :n, dueDate = :dd, done = :dn",
            ConditionExpression: "attribute_exists(todoId)",
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":n": updatedTodo.name,
                ":dd": updatedTodo.dueDate,
                ":dn": updatedTodo.done
            }
        }).promise()

        this.logger.info('updated todo', { todoId, userId })
    }
}
