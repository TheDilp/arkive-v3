import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import {
  BaseEditor,
  createEditor,
  Descendant,
  Editor,
  Range,
  Text,
  Transforms,
} from 'slate'
import { withHistory } from 'slate-history'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'
import { CHARACTERS } from '../chars'
import {
  CustomElement,
  CustomText,
  Document,
  ImageElement,
  MentionElement,
} from '../custom-types'
import {
  HeaderFiveEl,
  HeaderFourEl,
  HeaderOneEl,
  HeaderSixEl,
  HeaderThreeEl,
  HeaderTwoEl,
  Leaf,
  ParagraphEl,
} from '../elements'
import { fetchSingleDocument, saveDocument } from '../utils/supabaseClient'
import ImageComponent from './ImageComponent'
import Mention from './Mention'
import Portal from './Portal'
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

type Props = {
  content: string | null
  docId: string | null
}

export default function EditorComponent({ content, docId }: Props) {
  // Array of plugins to use in Editor

  const queryClient = useQueryClient()
  const ref =
    useRef<HTMLDivElement | null>() as React.MutableRefObject<HTMLDivElement>

  const insertMention = (editor: Editor, character: string) => {
    const mention: MentionElement = {
      type: 'mention',
      character,
      children: [{ text: '' }],
    }
    Transforms.insertNodes(editor, mention)
    Transforms.move(editor)
  }
  const insertImage = (editor: Editor, url: string) => {
    const text = { text: '' }
    const image: ImageElement = { type: 'image', url, children: [text] }
    Transforms.insertNodes(editor, image)
  }

  const withMentions = (editor: Editor) => {
    const { isInline, isVoid } = editor

    editor.isInline = (element) => {
      return element.type === 'mention' ? true : isInline(element)
    }

    editor.isVoid = (element) => {
      return element.type === 'mention' ? true : isVoid(element)
    }

    return editor
  }

  const [target, setTarget] = useState<Range | null>()
  const [index, setIndex] = useState(0)
  const [search, setSearch] = useState('')
  // Add the initial value when setting up our state.
  const [value, setValue] = useState<Descendant[]>()
  const [editor] = useState(() =>
    withReact(withMentions(withHistory(createEditor() as any)))
  )
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'mention':
        return <Mention {...props} />
      case 'image':
        return <ImageComponent {...props} />
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

  const qSD = useCallback(() => {
    const cachedData: [Document] | undefined = queryClient.getQueryData(
      docId as string
    )
    if (cachedData) {
      setValue(cachedData[0].content)
      editor.children = cachedData[0].content
    } else {
      querySingleDocument.refetch()
    }
  }, [docId])

  const querySingleDocument = useQuery(
    docId as string,
    async () => await fetchSingleDocument(docId as string),
    {
      enabled: false,
      staleTime: Infinity,
      onSuccess: (data: [Document]) => {
        setValue(data[0].content)
        editor.children = data[0].content
      },
    }
  )

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

  useEffect(() => {
    if (!content) {
      if (docId) {
        qSD()
        // const data = querySingleDocument.refetch()
        // console.log(data)
      }
    } else {
      setValue(JSON.parse(content))
      editor.children = JSON.parse(content)
    }
  }, [content, docId])

  const mentionCallback = useCallback(
    (event) => {
      if (target) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1
            setIndex(prevIndex)
            break
          case 'ArrowUp':
            event.preventDefault()
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1
            setIndex(nextIndex)
            break
          case 'Tab':
          case 'Enter':
            event.preventDefault()
            Transforms.select(editor, target)
            insertMention(editor, chars[index])
            setTarget(null)
            break
          case 'Escape':
            event.preventDefault()
            setTarget(null)
            break
        }
      }
    },
    [index, search, target]
  )

  return (
    <div className="prose m-0" style={{ maxWidth: '100vw' }}>
      <div className="mb-0 w-full text-center">
        <h1>
          Document Title
          <button
            onClick={() => {
              insertImage(editor, 'https://picsum.photos/200/300')
            }}
          >
            ImgBtn
          </button>
        </h1>
      </div>
      {value && (
        <div
          className="rounded py-0 px-4 shadow-md"
          style={{ minHeight: '80vh' }}
        >
          <Slate
            editor={editor}
            value={value}
            onChange={(value) => {
              setValue(value)
              const { selection } = editor

              if (selection && Range.isCollapsed(selection)) {
                const [start] = Range.edges(selection)
                const wordBefore = Editor.before(editor, start, {
                  unit: 'word',
                })
                const before = wordBefore && Editor.before(editor, wordBefore)
                const beforeRange =
                  before && Editor.range(editor, before, start)
                const beforeText =
                  beforeRange && Editor.string(editor, beforeRange)
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
              readOnly={content ? true : false}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={(event) => {
                if (content) return
                if (search) {
                  mentionCallback(event)
                }
                if (event.shiftKey) {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    Transforms.insertText(editor, '\n')
                    return
                  }
                }
                if (event.ctrlKey && event.key !== 'z' && event.key !== 'y') {
                  event.preventDefault()
                  // Select All
                  if (event.key === 'a') {
                    Transforms.select(editor, {
                      anchor: Editor.start(editor, []),
                      focus: Editor.end(editor, []),
                    })
                    return
                  } else if (event.shiftKey) {
                    //
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
                  } else if (event.key === 'c') {
                    if (editor.selection)
                      navigator.clipboard.writeText(
                        Editor.string(editor, editor.selection)
                      )
                  } else if (event.key === 'v') {
                    navigator.clipboard.readText().then((text) => {
                      if (text) {
                        Transforms.insertText(editor, text)
                      }
                    })
                  } else if (event.key === 's') {
                    saveDocument({ id: docId as string, content: value }).catch(
                      (err) => console.log(err)
                    )
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
      )}
    </div>
  )
}
