import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import ArticleCard from '../../../components/Articles/ArticleCard'
import ArticleRow from '../../../components/Articles/ArticleRow'
import DocumentsList from '../../../components/Editor/DocumentsList'
import EditorComponent from '../../../components/Editor/EditorComponent'
import Navbar from '../../../components/Navbar'
import { Document } from '../../../custom-types'
import { fetchDocuments } from '../../../utils/supabaseClient'

type Props = {}

export default function Editor({}: Props) {
  const [documents, setDocuments] = useState<Document[] | null>()
  const [currentDoc, setCurrentDoc] = useState<string | null>()
  const [view, setView] = useState(true)
  const router = useRouter()
  const { projectId } = router.query
  const query = useQuery(
    'allDocuments',
    async () => await fetchDocuments(projectId as string),
    {
      enabled: !!projectId,
      onSuccess: (data) => {
        setDocuments(data)
      },
      onError: (err) => alert(err),
    }
  )

  useEffect(() => {
    console.log(projectId)
    if (projectId) query.refetch()
  }, [projectId])

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
                  projectId={projectId as string}
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
