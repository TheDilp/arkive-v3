import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Project } from '../custom-types'

export default function ProjectCard({ id, title, cardImage }: Project) {
  return (
    <Link href={`/project/${id}/Editor`}>
      <div className="group h-96 w-1/4 cursor-pointer">
        <div className="h-full  w-5/6 rounded bg-white shadow">
          <div className="relative  h-3/4 w-full">
            <Image
              src={cardImage}
              layout="fill"
              objectFit="cover"
              className="rounded-t transition-transform group-hover:scale-110"
            />
          </div>
          <div className="flex h-1/4 w-full items-center justify-center">
            <h2 className="truncate text-3xl">{title}</h2>
          </div>
        </div>
      </div>
    </Link>
  )
}
