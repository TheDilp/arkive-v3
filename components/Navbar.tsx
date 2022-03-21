import React from 'react'

type Props = {}

export default function Navbar({}: Props) {
  return (
    <nav className="flex items-center justify-between space-x-4 bg-neutral-700 py-2 text-white shadow">
      <div>Logo</div>
      <div className="mx-auto flex">
        <span className="mx-auto text-4xl">ArKive</span>
      </div>
      <div className="flex justify-between space-x-2">
        <span className="">Profile</span>
        <span className="pr-2">Logout</span>
      </div>
    </nav>
  )
}
