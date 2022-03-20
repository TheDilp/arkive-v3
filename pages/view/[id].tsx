import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import EditorComponent from '../../components/EditorComponent'

type Props = {}

export default function ViewPage({}: Props) {
  const router = useRouter()
  const { id } = router.query
  const [content, setContent] = useState<string | null>(null)

  useEffect(() => {
    let ls = localStorage.getItem('doc')
    if (ls) {
      setContent(ls)
    }
  }, [])
  return (
    <article className="flex justify-center" style={{ minHeight: '100vh' }}>
      {content && (
        <div className="flex w-2/3 rounded shadow-lg">
          <EditorComponent content={content} />
        </div>
      )}
    </article>
  )
}
