import React, { useEffect } from 'react'
import EditorComponent from '../../components/EditorComponent'
import Navbar from '../../components/Navbar'
import { fetchDocuments } from '../../utils/supabaseClient'

type Props = {}

export default function EditorPage({}: Props) {
  useEffect(() => {}, [])

  return (
    <div>
      <Navbar />
      <div className="mt-2 flex justify-center ">
        <div className="w-2/3  rounded p-4 shadow-lg">
          <EditorComponent content={null} />
        </div>
      </div>
    </div>
  )
}
