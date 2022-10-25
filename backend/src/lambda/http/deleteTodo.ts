import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger("deleteTodo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("## DELETING TODO ... ##");
    try {
      const todoId = event.pathParameters.todoId
      
      // TODO: Remove a TODO item by id
      const user = getUserId(event);
      const deletedItem = await deleteTodo(user, todoId);
      
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          "message": "Todo had been deleted!",
          deletedItem
        })
      }
    } catch (error) {
      logger.error('## DELETE TODO FAILED: ', { error });
      return {
        statusCode: 500,
        body: JSON.stringify({
          "message": "System errors", error
        })
      }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )