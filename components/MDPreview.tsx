import React, { useCallback, useState } from 'react'
import { createEditor, Editor, Transforms } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
type CustomElement = {
  type: 'paragraph' | 'header-one'
  children: CustomText[]
}
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
  const ParagraphEl = (props: { attributes: any; children: any }) => {
    return <p {...props.attributes}>{props.children}</p>
  }
  const HeaderOneEl = (props: { attributes: any; children: any }) => {
    return <h1 {...props.attributes}>{props.children}</h1>
  }

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'header-one':
        return <HeaderOneEl {...props} />
      default:
        return <ParagraphEl {...props} />
    }
  }, [])

  return (
    <div className="prose m-0" style={{ maxWidth: '100vw' }}>
      <Slate editor={editor} value={value} onChange={setValue}>
        <Editable
          renderElement={renderElement}
          onKeyDown={(event) => {
            if (event.key === '1' && event.ctrlKey) {
              console.log(event.key)
              event.preventDefault()
              Transforms.setNodes(
                editor,
                { type: 'header-one' },
                { match: (n) => Editor.isBlock(editor, n) }
              )
            }
          }}
        />
      </Slate>
    </div>
  )
}
