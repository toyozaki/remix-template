import { Todo } from '@prisma/client'
import clsx from 'clsx'
import {
  ActionFunction,
  Form,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
  useSearchParams,
  useTransition,
} from 'remix'

import { Button, Textarea } from '~/components'
import { getStatus, validateTodoStatus, validateTodoTitle } from '~/models/todo'
import { db } from '~/utils'

export const loader: LoaderFunction = async ({ request }) => {
  // throw error
  // throw new Error('Throw a error from loader.')
  // throw new Response(`Throw a error from loader`, { status: 404, statusText: 'Not found' })

  const url = new URL(request.url)
  const status = getStatus(url.searchParams)

  return db.todo.findMany({
    where: status === 'all' ? {} : { status },
    orderBy: { createdAt: 'desc' },
  })
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    id?: string
    title: string | undefined
    status?: string
  }
  fields?: {
    id?: string
    title: string
    status?: string
  }
  method?: string
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()

  const method = form.get('method')
  if (typeof method !== 'string') return badRequest({ formError: `Form not submitted correctly.` })

  const title = form.get('title')
  if (typeof title !== 'string')
    return badRequest({ formError: `Form not submitted correctly.`, method })

  if (method === 'POST') {
    const fields = {
      title,
    }
    const fieldErrors = {
      title: validateTodoTitle(title),
    }

    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({ fieldErrors, fields, method })
    }

    await db.todo.create({
      data: {
        title,
        status: 'new',
      },
    })

    return redirect('/todo')
  } else if (method === 'PATCH') {
    const id = form.get('id')
    const status = form.get('status')

    if (typeof id !== 'string')
      return badRequest({
        formError: 'Form not submitted correctly.',
        method,
      })

    if (typeof status !== 'string')
      return badRequest({
        formError: 'Form not submitted correctly.',
        method,
      })

    const fields = {
      id,
      title,
      status,
    }
    const fieldErrors = {
      title: validateTodoTitle(title),
      status: validateTodoStatus(status),
    }

    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({ fieldErrors, fields, method })
    }

    await db.todo.update({
      data: {
        title,
        status,
      },
      where: { id },
    })

    return redirect('/todo')
  }
}

const NewButton = ({ disabled = false, className }: { disabled?: boolean; className?: string }) => (
  <Button
    name="status"
    value="new"
    type="submit"
    size="small"
    disabled={disabled}
    className={className}
  >
    new
  </Button>
)

const PendingButton = ({
  disabled = false,
  className,
}: {
  disabled?: boolean
  className?: string
}) => (
  <Button
    name="status"
    value="pending"
    type="submit"
    size="small"
    disabled={disabled}
    className={clsx(
      `text-red-400 hover:text-red-500 rounded-md border-2 border-red-400 hover:border-red-500 ${
        disabled ? '' : 'active:text-red-600 active:border-red-600'
      }`,
      className
    )}
  >
    PENDING
  </Button>
)

const WipButton = ({ disabled = false, className }: { disabled?: boolean; className?: string }) => (
  <Button
    name="status"
    value="wip"
    type="submit"
    size="small"
    disabled={disabled}
    className={clsx(
      `text-yellow-400 hover:text-yellow-500 rounded-md border-2 border-yellow-400 hover:border-yellow-500 ${
        disabled ? '' : 'active:text-yellow-600 active:border-yellow-600'
      }`,
      className
    )}
  >
    WIP
  </Button>
)

const DoneButton = ({
  disabled = false,
  className,
}: {
  disabled?: boolean
  className?: string
}) => (
  <Button
    name="status"
    value="done"
    type="submit"
    size="small"
    disabled={disabled}
    className={clsx(
      `text-green-400 hover:text-green-500 rounded-md border-2 border-green-400 hover:border-green-500 ${
        disabled ? '' : 'active:text-green-600 active:border-green-600'
      }`,
      className
    )}
  >
    DONE
  </Button>
)

const ToggleButtons = ({ status, className }: { status: string; className?: string }) => {
  return (
    <div className={className}>
      <div className="my-2">
        <Link
          to="?status=all"
          className={clsx(
            `p-2 rounded-l-md border-y border-l border-gray-200`,
            status === 'all' ? 'text-white bg-gray-500' : 'text-gray-700'
          )}
        >
          All
        </Link>
        <Link
          to="?status=new"
          className={clsx(
            `p-2 border-y border-l border-gray-200`,
            status === 'new' ? 'text-white bg-gray-500' : 'text-gray-700'
          )}
        >
          New
        </Link>
        <Link
          to="?status=pending"
          className={clsx(
            `p-2 border-y border-l border-gray-200`,
            status === 'pending' ? 'text-white bg-gray-500' : 'text-gray-700'
          )}
        >
          Pending
        </Link>
        <Link
          to="?status=wip"
          className={clsx(
            `p-2 border-y border-l border-gray-200`,
            status === 'wip' ? 'text-white bg-gray-500' : 'text-gray-700'
          )}
        >
          Wip
        </Link>
        <Link
          to="?status=done"
          className={clsx(
            `p-2 rounded-r-md border border-gray-200`,
            status === 'done' ? 'text-white bg-gray-500' : 'text-gray-700'
          )}
        >
          Done
        </Link>
      </div>
    </div>
  )
}

const statusColor = (status: Todo['status']) => {
  switch (status) {
    case 'new':
      return 'border-l-blue-300'
    case 'pending':
      return 'border-l-red-300'
    case 'wip':
      return 'border-l-yellow-300'
    case 'done':
      return 'border-l-green-300'
    default:
      throw new Error(`Unexpected status: ${status}`)
  }
}

export default function Index() {
  const todo = useLoaderData<Todo[]>()
  const transition = useTransition()
  const submissioning = Boolean(transition.submission)
  const actionData = useActionData<ActionData>()

  const [searchParams, _] = useSearchParams()
  const status = getStatus(searchParams)

  return (
    <div className="flex flex-col flex-1 p-4 space-y-2 ">
      <Form method="post" className="flex flex-col mt-5">
        <input hidden name="method" defaultValue="POST" />

        <Textarea
          id="title"
          name="title"
          defaultValue={actionData?.fields?.title}
          placeholder="What's happining?"
          className="flex-1"
        />

        {actionData?.method !== 'PATCH' && actionData?.formError ? (
          <p className="text-red-400" role="alert" id="form-error">
            {actionData.formError}
          </p>
        ) : null}

        {actionData?.fieldErrors?.title ? (
          <p className="text-red-400" role="alert" id="title-error">
            {actionData.fieldErrors.title}
          </p>
        ) : null}

        <div className="flex flex-row flex-1 justify-end mt-2">
          <Button
            type="submit"
            variant="containerd"
            disabled={submissioning}
            loading={submissioning}
          >
            Add
          </Button>
        </div>
      </Form>

      <ToggleButtons status={status} className="self-end" />

      {todo.length === 0 ? (
        <p className="self-center mt-5 text-2xl font-bold">Todo not found😧</p>
      ) : (
        <ul>
          {todo.map(t => (
            <li
              key={t.id}
              className={`p-3 mt-2 rounded-md border border-l-8 break-words ${statusColor(
                t.status
              )}`}
            >
              {t.title}

              <Form method="post">
                <input hidden name="method" defaultValue="PATCH" />
                <input hidden name="id" defaultValue={t.id} />
                <input hidden name="title" defaultValue={t.title} />

                <div className="flex mt-1 space-x-2">
                  {status !== 'new' && <NewButton />}
                  {status !== 'pending' && <PendingButton />}
                  {status !== 'wip' && <WipButton />}
                  {status !== 'done' && <DoneButton />}
                </div>
              </Form>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return (
      <div className="flex-1 p-4">
        <p className="text-2xl text-center text-red-300">
          {`${caught.data}: ${caught.statusText}`}
        </p>
        <p className="text-2xl text-center text-red-300">
          This error is displayed from CatchBoundary
        </p>
      </div>
    )
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}

export const ErrorBoundary = () => {
  return (
    <div className="flex-1 p-4">
      <p className="text-2xl text-center text-red-300">
        Something unexpected went wrong. Sorry about that😮‍💨
      </p>
      <p className="text-2xl text-center text-red-300">
        This error is displayed from ErrorBoundary
      </p>
    </div>
  )
}
