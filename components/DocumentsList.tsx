import React from 'react'
import { Document } from '../custom-types'

type Props = {
  documents: Document[] | null | undefined
  selectDocument: (id: string) => void
}

export default function DocumentsList({ documents, selectDocument }: Props) {
  return (
    <ul className="">
      {documents &&
        documents.map((doc) => (
          <li
            onClick={() => selectDocument(doc.id)}
            className="cursor-pointer text-center hover:bg-blue-400"
            key={doc.id}
          >
            {doc.title}
          </li>
        ))}
    </ul>
  )
}
