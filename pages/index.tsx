import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import Navbar from '../components/Navbar'
import ProjectCard from '../components/ProjectCard'
import { Project } from '../custom-types'
import { fetchAllProjects } from '../utils/supabaseClient'
const Home: NextPage = () => {
  const { data, error } = useQuery('allProjects', async () =>
    fetchAllProjects()
  )
  return (
    <div className="flex min-h-screen w-screen items-start">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full text-center">
        <Navbar />
        <div className="mt-2 flex h-screen justify-center space-x-1">
          {data &&
            data.map((project: Project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
        </div>
      </main>
    </div>
  )
}

export default Home
