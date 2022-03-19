import { useRouter } from 'next/router'
import React from 'react'

type Props = {}

export default function ViewPage({}: Props) {
  const router = useRouter()
  const { id } = router.query
  return <div>{id}</div>
}
