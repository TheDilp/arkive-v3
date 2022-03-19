import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createEditor, Editor, Range, Text, Transforms } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import Portal from './Portal'
import { CHARACTERS } from '../chars'
type CustomElement = {
  type: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  children: CustomText[]
}
type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

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
  const ref =
    useRef<HTMLDivElement | null>() as React.MutableRefObject<HTMLDivElement>
  const [editor] = useState(() => withReact(createEditor() as any))
  const [target, setTarget] = useState<Range | null>()
  const [index, setIndex] = useState(0)
  const [search, setSearch] = useState('')
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
  const Leaf = (props: {
    attributes: any
    leaf: any
    children: CustomText[]
  }) => {
    return (
      <span
        {...props.attributes}
        style={{
          fontWeight: props.leaf.bold ? 'bold' : 'normal',
          fontStyle: props.leaf.italic ? 'italic' : '',
          textDecoration: props.leaf.underline ? 'underline' : '',
        }}
      >
        {props.children}
      </span>
    )
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
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />
  }, [])

  function transformText(type: string) {
    Transforms.setNodes(
      editor,
      { type },
      { match: (n) => Editor.isBlock(editor, n) }
    )
  }
  function toggleMark(type: string) {
    const marks = Editor.marks(editor)
    if (type === 'bold') {
      Transforms.setNodes(
        editor,
        { bold: marks?.bold ? false : true },
        { match: (n) => Text.isText(n), split: true }
      )
    } else if (type === 'italic') {
      Transforms.setNodes(
        editor,
        { italic: marks?.italic ? false : true },
        { match: (n) => Text.isText(n), split: true }
      )
    } else if (type === 'underline') {
      Transforms.setNodes(
        editor,
        { underline: marks?.underline ? false : true },
        { match: (n) => Text.isText(n), split: true }
      )
    }
  }
  const chars = CHARACTERS.filter((c) =>
    c.toLowerCase().startsWith(search.toLowerCase())
  ).slice(0, 10)

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current
      const domRange = ReactEditor.toDOMRange(editor, target)
      const rect = domRange.getBoundingClientRect()
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`
        el.style.left = `${rect.left + window.pageXOffset}px`
      }
    }
  }, [chars.length, editor, index, search, target])
  return (
    <div className="prose m-0" style={{ maxWidth: '100vw' }}>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          setValue(value)
          const { selection } = editor

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection)
            const wordBefore = Editor.before(editor, start, { unit: 'word' })
            const before = wordBefore && Editor.before(editor, wordBefore)
            const beforeRange = before && Editor.range(editor, before, start)
            const beforeText = beforeRange && Editor.string(editor, beforeRange)
            const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
            const after = Editor.after(editor, start)
            const afterRange = Editor.range(editor, start, after)
            const afterText = Editor.string(editor, afterRange)
            const afterMatch = afterText.match(/^(\s|$)/)

            if (beforeMatch && afterMatch) {
              setTarget(beforeRange)
              setSearch(beforeMatch[1])
              setIndex(0)
              return
            }
          }
          setTarget(null)
        }}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            if (event.key === '@') {
              event.preventDefault()
              alert('@@@@@')
            }
            if (event.ctrlKey) {
              event.preventDefault()
              // Select All
              if (event.key === 'a') {
                Transforms.select(editor, {
                  anchor: Editor.start(editor, []),
                  focus: Editor.end(editor, []),
                })
                return
              }
              //   Headers
              if (event.key === '1') {
                transformText('header-one')
              } else if (event.key === '2') {
                transformText('header-two')
              } else if (event.key === '3') {
                transformText('header-three')
              } else if (event.key === '4') {
                transformText('header-four')
              } else if (event.key === '5') {
                transformText('header-five')
              } else if (event.key === '6') {
                transformText('header-six')
              } else if (event.key === 'p') {
                transformText('paragraph')
              } else if (event.key === 'b') {
                toggleMark('bold')
              } else if (event.key === 'i') {
                toggleMark('italic')
              } else if (event.key === 'u') {
                toggleMark('underline')
              }
            }
          }}
        />
        {target && chars.length > 0 && ref && (
          <Portal>
            <div
              ref={ref}
              style={{
                top: '-9999px',
                left: '-9999px',
                position: 'absolute',
                zIndex: 1,
                padding: '3px',
                background: 'white',
                borderRadius: '4px',
                boxShadow: '0 1px 5px rgba(0,0,0,.2)',
              }}
              data-cy="mentions-portal"
            >
              {chars.map((char, i) => (
                <div
                  key={char}
                  style={{
                    padding: '1px 3px',
                    borderRadius: '3px',
                    background: i === index ? '#B4D5FF' : 'transparent',
                  }}
                >
                  {char}
                </div>
              ))}
            </div>
          </Portal>
        )}
      </Slate>
    </div>
  )
}
