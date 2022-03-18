import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import MDPreview from '../components/MDPreview'
const Home: NextPage = () => {
  const [text, setText] = useState<string>('# This is a [[test]]')
  return (
    <div className="flex min-h-screen items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-8xl flex w-full items-center justify-center text-center">
        <div className="w-1/2 bg-green-400">
          <textarea value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="prose w-1/2 bg-blue-400">
          <MDPreview text={text} />
        </div>
      </main>
    </div>
  )
}

export default Home
