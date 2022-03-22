import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Descendant } from 'slate'
import EditorComponent from '../../components/EditorComponent'
import { Document } from '../../custom-types'
import { fetchSingleDocument } from '../../utils/supabaseClient'

type Props = {}

export default function ViewPage({}: Props) {
  const router = useRouter()
  const { id } = router.query
  const [document, setDocument] = useState<Document | null>(null)

  const { data, error } = useQuery(
    `${id}-view`,
    async () => await fetchSingleDocument(id as string),
    {
      onSuccess(data: [Document]) {
        setDocument(data[0])
      },
    }
  )

  return (
    <article className="flex justify-center" style={{ minHeight: '100vh' }}>
      {document && (
        <div className="flex w-2/3 flex-col rounded">
          <div className="relative h-1/6 w-full">
            <div className="z-5 absolute mb-0 w-full text-center">
              <h1 className="text-4xl">Document Title</h1>
            </div>
            <Image src={document.image} layout="fill" objectFit="cover" />
          </div>
          <EditorComponent content={document.content} docId={id as string} />
        </div>
      )}
    </article>
  )
}
