import React from 'react'
import ReactMarkdown from 'react-markdown'
type Props = {
  text: string
}

export default function MDPreview({ text }: Props) {
  return <ReactMarkdown>{text}</ReactMarkdown>
}
