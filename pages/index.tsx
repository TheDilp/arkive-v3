import type { NextPage } from 'next'
import Head from 'next/head'
const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen w-screen items-start">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full text-center">MAIN PAGE</main>
    </div>
  )
}

export default Home
