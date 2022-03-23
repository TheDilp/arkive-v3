import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import ArticleCard from '../components/ArticleCard'
import ArticleRow from '../components/ArticleRow'
import DocumentsList from '../components/DocumentsList'
import EditorComponent from '../components/EditorComponent'
import Navbar from '../components/Navbar'
import { Document } from '../custom-types'
import { fetchDocuments } from '../utils/supabaseClient'

type Props = {}

export default function Editor({}: Props) {
  const [documents, setDocuments] = useState<Document[] | null>()
  const [currentDoc, setCurrentDoc] = useState<string | null>()
  const [view, setView] = useState(false)
  const query = useQuery('allDocuments', async () => await fetchDocuments(), {
    onSuccess: (data) => {
      setDocuments(data)
    },
    onError: (err) => alert(err),
  })

  return (
    <div>
      <Navbar />
      {!currentDoc && (
        <div>
          <button
            className="rounded bg-blue-400 p-2"
            onClick={() => setView(!view)}
          >
            Change View
          </button>
        </div>
      )}
      <div className="mt-2 flex justify-center ">
        <div className="flex w-5/6 flex-wrap justify-center">
          {documents &&
            !currentDoc &&
            documents.map((doc) =>
              view ? (
                <ArticleCard
                  key={doc.id}
                  {...doc}
                  setCurrentDoc={setCurrentDoc}
                />
              ) : (
                <ArticleRow
                  key={doc.id}
                  {...doc}
                  setCurrentDoc={setCurrentDoc}
                />
              )
            )}
          {currentDoc && (
            <div className="mt-2 flex w-full justify-center space-x-2 ">
              <DocumentsList
                documents={documents}
                selectDocument={setCurrentDoc}
                currentDoc={currentDoc}
              />
              <div className="mx-auto w-4/5">
                <EditorComponent
                  content={null}
                  docId={currentDoc}
                  allDocuments={documents}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
