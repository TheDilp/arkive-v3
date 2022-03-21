import React, { useEffect, useState } from 'react'
import EditorComponent from '../components/EditorComponent'
import Navbar from '../components/Navbar'
import { Document } from '../custom-types'
import { fetchDocuments } from '../utils/supabaseClient'

type Props = {}

export default function Editor({}: Props) {
  const [documents, setDocuments] = useState<Document[] | null>()

  useEffect(() => {
    fetchDocuments().then((docs) => setDocuments(docs))
    console.log(documents)
  }, [])
  return (
    <div>
      <Navbar />

      <div className="mt-2 flex justify-center ">
        <div className="w-2/3  rounded p-4 shadow-lg">
          {documents && documents.map((doc) => <div> {doc.title} </div>)}
        </div>
      </div>
    </div>
  )
}
