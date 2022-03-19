import React, { useCallback, useState } from 'react'
import { createEditor, Editor, Transforms } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
type CustomElement = {
  type: string
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
  const HeaderTwoEl = (props: { attributes: any; children: any }) => {
    return <h2 {...props.attributes}>{props.children}</h2>
  }
  const HeaderThreeEl = (props: { attributes: any; children: any }) => {
    return <h3 {...props.attributes}>{props.children}</h3>
  }
  const HeaderFourEl = (props: { attributes: any; children: any }) => {
    return <h4 {...props.attributes}>{props.children}</h4>
  }
  const HeaderFiveEl = (props: { attributes: any; children: any }) => {
    return <h5 {...props.attributes}>{props.children}</h5>
  }
  const HeaderSixEl = (props: { attributes: any; children: any }) => {
    return <h6 {...props.attributes}>{props.children}</h6>
  }

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'header-one':
        return <HeaderOneEl {...props} />
      case 'header-two':
        return <HeaderTwoEl {...props} />
      case 'header-three':
        return <HeaderThreeEl {...props} />
      case 'header-four':
        return <HeaderFourEl {...props} />
      case 'header-five':
        return <HeaderFiveEl {...props} />
      case 'header-six':
        return <HeaderSixEl {...props} />
      default:
        return <ParagraphEl {...props} />
    }
  }, [])

  function transformHeader(type: string) {
    Transforms.setNodes(
      editor,
      { type },
      { match: (n) => Editor.isBlock(editor, n) }
    )
  }

  return (
    <div className="prose m-0" style={{ maxWidth: '100vw' }}>
      <Slate editor={editor} value={value} onChange={setValue}>
        <Editable
          renderElement={renderElement}
          onKeyDown={(event) => {
            if (event.ctrlKey) {
              // Select All
              if (event.key === 'a') {
                Transforms.select(editor, {
                  anchor: Editor.start(editor, []),
                  focus: Editor.end(editor, []),
                })
                return
              }
              event.preventDefault()
              //   Headers
              if (event.key === '1') {
                transformHeader('header-one')
              } else if (event.key === '2') {
                transformHeader('header-two')
              } else if (event.key === '3') {
                transformHeader('header-three')
              } else if (event.key === '4') {
                transformHeader('header-four')
              } else if (event.key === '5') {
                transformHeader('header-five')
              } else if (event.key === '6') {
                transformHeader('header-six')
              }
            }
          }}
        />
      </Slate>
    </div>
  )
}
