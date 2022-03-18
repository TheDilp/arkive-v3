import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import MDPreview from '../components/MDPreview'
const Home: NextPage = () => {
  const [text, setText] = useState<string>('# This is a [[test]]')
  return (
    <div className="flex min-h-screen w-screen items-start">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full text-center">
        <div className="w-full bg-blue-400">
          <MDPreview text={text} />
        </div>
      </main>
    </div>
  )
}

export default Home
