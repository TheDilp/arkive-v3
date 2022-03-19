import React from 'react'
import { useSelected, useFocused } from 'slate-react'
import { CustomText } from '../custom-types'
type Props = {
  attributes: any
  children: CustomText
  element: any
}

export default function Mention({ attributes, children, element }: Props) {
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
    >
      @{element.character}
      {children}
    </span>
  )
}
