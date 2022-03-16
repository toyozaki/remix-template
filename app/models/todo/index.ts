import { json } from 'remix'

import { db } from '~/utils'

export const getStatus = (params: URLSearchParams) => {
  const s = params.get('status')

  switch (s) {
    case 'new':
      return 'new'
    case 'pending':
      return 'pending'
    case 'wip':
      return 'wip'
    case 'done':
      return 'done'
    default:
      return 'all'
  }
}

export const validateTodoTitle = (title: string) => {
  if (title.length < 1) return "That todo's title is too short."
  if (title.length > 255) return "That todo's titles is too long"
}

export const validateTodoStatus = (status: any) => {
  if (!['new', 'pending', 'wip', 'done'].includes(status))
    return "Todo's status must be [new, pending, wip, done]"
}

export const getTodos = async (_request: Request) => {
  const todos = await db.todo.findMany()
  return json(todos, { status: 200 })
}
