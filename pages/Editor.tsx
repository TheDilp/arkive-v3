import React from 'react'
import EditorComponent from '../components/EditorComponent'

type Props = {}

export default function Editor({}: Props) {
  return (
    <div className="mt-2 flex max-h-full justify-center ">
      <div className="w-2/3 overflow-y-scroll rounded p-4 shadow">
        <EditorComponent />
      </div>
    </div>
  )
}
