import React, { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import EditorComponent from '../components/EditorComponent'
import Navbar from '../components/Navbar'
import { Document } from '../custom-types'
import { fetchDocuments } from '../utils/supabaseClient'

type Props = {}

export default function Editor({}: Props) {
  const [documents, setDocuments] = useState<Document[] | null>()

  useEffect(() => {
    fetchDocuments().then((docs) => setDocuments(docs))
  }, [])
  return (
    <div>
      <Navbar />

      <div className="mt-2 flex justify-center ">
        <div className="flex w-2/3 flex-wrap">
          {documents &&
            documents.map((doc) => <ArticleCard key={doc.id} {...doc} />)}
        </div>
      </div>
    </div>
  )
}
