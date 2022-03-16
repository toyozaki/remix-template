import { Link, Outlet } from 'remix'

import { Copyright } from '~/components'

export default function Todo() {
  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      <header>
        <h1 className="pt-4 font-serif text-3xl font-bold text-center underline">
          <Link to="/todo">Manage your todo😪</Link>
        </h1>
      </header>

      <main className="flex flex-col">
        <Outlet />
      </main>

      <footer className="flex flex-row justify-center">
        <Copyright className="p-2" />
      </footer>
    </div>
  )
}
