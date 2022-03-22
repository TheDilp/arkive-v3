import React, { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import DocumentsList from '../components/DocumentsList'
import EditorComponent from '../components/EditorComponent'
import Navbar from '../components/Navbar'
import { Document } from '../custom-types'
import { fetchDocuments } from '../utils/supabaseClient'

type Props = {}

export default function Editor({}: Props) {
  const [documents, setDocuments] = useState<Document[] | null>()
  const [currentDoc, setCurrentDoc] = useState<string | null>()

  useEffect(() => {
    fetchDocuments().then((docs) => setDocuments(docs))
  }, [])
  return (
    <div>
      <Navbar />

      <div className="mt-2 flex justify-center ">
        <div className="flex w-2/3 flex-wrap justify-center ">
          {documents &&
            !currentDoc &&
            documents.map((doc) => (
              <ArticleCard
                key={doc.id}
                {...doc}
                setCurrentDoc={setCurrentDoc}
              />
            ))}
          {currentDoc && (
            <div className="mt-2 flex w-full justify-center ">
              <DocumentsList />
              <div className="mx-auto w-2/3 ">
                <EditorComponent content={null} docId={currentDoc} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
