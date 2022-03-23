import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar'
const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen w-screen items-start">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full text-center">
        <Navbar />
        <div className="mt-2 flex h-screen justify-center space-x-1">
          <Link href="/Editor">
            <div className="group h-96 w-1/4 cursor-pointer">
              <div className="h-full  w-5/6 rounded bg-white shadow">
                <div className="relative  h-3/4 w-full">
                  <Image
                    src={'/projects.jpg'}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="flex h-1/4 w-full items-center justify-center">
                  <h2 className="truncate text-2xl">Projects</h2>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/Editor">
            <div className="group h-96 w-1/4 cursor-pointer">
              <div className="h-full  w-5/6 rounded bg-white shadow">
                <div className="relative  h-3/4 w-full">
                  <Image
                    src={'/randompage.jpg'}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="flex h-1/4 w-full items-center justify-center">
                  <h2 className="truncate text-2xl">Random Page</h2>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
