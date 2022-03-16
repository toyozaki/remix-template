import { json, LoaderFunction } from 'remix'

import { getTodos } from '~/models/todo'

export const METHOD_NOT_ALLOWED = json('Method Not Allowed', { status: 405 })

export const loader: LoaderFunction = async ({ request }) => {
  const method = request.method.toUpperCase()

  switch (method) {
    case 'GET':
      return getTodos(request)
    default:
      return METHOD_NOT_ALLOWED
  }
}
