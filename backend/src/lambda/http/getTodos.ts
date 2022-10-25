import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // DONE: Get all TODO items for a current user
    logger.info('## GETTING ALL TODOS ... ##')

    try {
      const userId = getUserId(event)
      logger.info('## GET USER ID ##')

      const todos = await getAllTodos(userId)
      logger.info('## GET ALL TODOS SUCCESSFULLY ##')

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          items: todos
        })
      }
    } catch (error) {
      logger.error('## GET ALL TODOS FAILED ##', { error })
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'System errors'
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
