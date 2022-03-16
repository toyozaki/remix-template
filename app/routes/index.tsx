import { Link } from 'remix'

import { Copyright } from '~/components'

export default function Index() {
  return (
    <div className="flex flex-col flex-1 bg-blue-200">
      <main className="flex flex-col flex-1 justify-center">
        <div>
          <h1 className="text-6xl font-bold text-center text-white underline">
            <Link to="/todo" prefetch="intent">
              Manage your todo🏃
            </Link>
          </h1>
        </div>
      </main>

      <footer className="flex flex-row justify-center">
        <Copyright className="p-2 text-white" />
      </footer>
    </div>
  )
}
