import React, { useState } from 'react'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
type Props = {
  text: string
}

export default function MDPreview({ text }: Props) {
  const [editor] = useState(() => withReact(createEditor() as any))
  // Add the initial value when setting up our state.
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])

  return (
    <div className="w-full">
      <Slate editor={editor} value={value} onChange={setValue}>
        <Editable />
      </Slate>
    </div>
  )
}
