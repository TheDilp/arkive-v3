import React from 'react'

type Props = {
  text: string
}

export default function Article({ text }: Props) {
  return <div>{text}</div>
}
