import React from 'react'
import EditorComponent from '../components/EditorComponent'

type Props = {}

export default function Editor({}: Props) {
  return (
    <div className="mt-2 flex justify-center ">
      <div className="w-2/3  rounded p-4 shadow-lg">
        <EditorComponent />
      </div>
    </div>
  )
}
