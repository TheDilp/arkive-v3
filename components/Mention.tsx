import { nanoid } from 'nanoid'
import React from 'react'
import { useSelected, useFocused } from 'slate-react'
import { CustomText, MentionElement } from '../custom-types'
import { useRouter } from 'next/router'
type Props = {
  attributes: any
  children: CustomText
  element: MentionElement
}

export default function Mention({ attributes, children, element }: Props) {
  const id = nanoid()
  const router = useRouter()
  const selected = useSelected()
  const focused = useFocused()
  return (
    <span
      className=" cursor-pointer rounded bg-blue-400 p-0.5 text-base text-white transition-colors hover:bg-blue-300 hover:text-gray-800"
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(' ', '-')}`}
      style={{
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
      onClick={(e) => router.push(`./view/${id}`)}
    >
      @{element.character}
      {children}
    </span>
  )
}
