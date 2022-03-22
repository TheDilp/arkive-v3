import React from 'react'
import { Document } from '../custom-types'

type Props = {
  documents: Document[] | null | undefined
  selectDocument: (id: string) => void
  currentDoc: string | null | undefined
}

export default function DocumentsList({
  documents,
  selectDocument,
  currentDoc,
}: Props) {
  return (
    <ul className="flex w-1/5 flex-col items-center justify-start border-x-2 border-b-2">
      {documents &&
        documents.map((doc) => (
          <li
            onClick={() => selectDocument(doc.id)}
            className={`w-full cursor-pointer text-center last:border-b-2 odd:border-y-2 hover:bg-blue-300 ${
              currentDoc ? (currentDoc === doc.id ? 'bg-blue-400' : '') : ''
            }`}
            key={doc.id}
          >
            {doc.title}
          </li>
        ))}
    </ul>
  )
}
