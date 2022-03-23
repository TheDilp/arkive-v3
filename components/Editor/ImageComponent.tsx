import Image from 'next/image'
import React from 'react'
import { CustomText, ImageElement } from '../../custom-types'

type Props = {
  attributes: any
  element: ImageElement
}

export default function ImageComponent({
  attributes,
  element: { url },
}: Props) {
  return (
    <span
      {...attributes}
      style={{ userSelect: 'none' }}
      contentEditable="false"
    >
      <Image src={url} width="200" height="300" />
    </span>
  )
}
