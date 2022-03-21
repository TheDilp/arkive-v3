import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import EditorComponent from '../../components/EditorComponent'
import Navbar from '../../components/Navbar'
import { Document } from '../../custom-types'
import { fetchSingleDocument } from '../../utils/supabaseClient'

type Props = {}

export default function EditorPage({}: Props) {
  return (
    <div>
      <Navbar />
      <div className="mt-2 flex justify-center ">
        <div className="w-2/3 ">
          <EditorComponent content={null} />
        </div>
      </div>
    </div>
  )
}
