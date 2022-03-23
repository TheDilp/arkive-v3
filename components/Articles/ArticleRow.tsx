import React from 'react'

type Props = {
  id: string
  title: string
  image: string
  setCurrentDoc: (id: string) => void
}

export default function ArticleRow({ id, title, setCurrentDoc }: Props) {
  return (
    <div className="group flex w-full">
      <div
        className="mx-auto w-1/2 cursor-pointer group-odd:border-y-2"
        onClick={() => setCurrentDoc(id)}
      >
        {title}
      </div>
    </div>
  )
}
