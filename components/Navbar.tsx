import Link from 'next/link'
import React from 'react'

type Props = {}

export default function Navbar({}: Props) {
  return (
    <nav className="flex items-center justify-between space-x-4 bg-neutral-700 py-2 text-white shadow">
      <div className="mx-auto flex">
        <span className="mx-auto cursor-pointer text-4xl">
          <Link href="/">ArKive</Link>
        </span>
      </div>
      <div className="flex justify-between space-x-2 pr-2">
        <span className="cursor-pointer">Profile</span>
        <span className="cursor-pointer">Logout</span>
      </div>
    </nav>
  )
}
