import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodo } from '../../businessLogic/todos'

import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('## CREATING TODO... ##')

    try {
      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      const userId = getUserId(event)
      const todo = await createTodo(newTodo, userId)

      logger.info('## CREATE TODO SUCCESSFULLY ##')
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          item: todo
        })
      }
    } catch (error) {
      logger.error('## CREATE TODO FAILED ##', { error })
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'System errors',
          error: error
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
