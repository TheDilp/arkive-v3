import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom'
type Props = {
  children: JSX.Element
}

export default function Portal({ children }: Props) {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}
