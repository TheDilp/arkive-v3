export type CustomElement = {
  type: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  children: CustomText[]
  character?: string
}
export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}
export type MentionElement = {
  type: 'mention'
  character: string
  children: CustomText[]
}

export type ImageElement = {
  type: 'image'
  url: string
  children: CustomText[]
}

export type Document = {
  id: string
  title: string
  image: string
}
