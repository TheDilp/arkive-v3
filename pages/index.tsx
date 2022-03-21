import type { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '../components/Navbar'
const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen w-screen items-start">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="w-full text-center">MAIN PAGE</main>
    </div>
  )
}

export default Home
