import { CustomText } from './custom-types'

export const ParagraphEl = (props: { attributes: any; children: any }) => {
  return <p {...props.attributes}>{props.children}</p>
}
export const HeaderOneEl = (props: { attributes: any; children: any }) => {
  return <h1 {...props.attributes}>{props.children}</h1>
}
export const HeaderTwoEl = (props: { attributes: any; children: any }) => {
  return <h2 {...props.attributes}>{props.children}</h2>
}
export const HeaderThreeEl = (props: { attributes: any; children: any }) => {
  return <h3 {...props.attributes}>{props.children}</h3>
}
export const HeaderFourEl = (props: { attributes: any; children: any }) => {
  return <h4 {...props.attributes}>{props.children}</h4>
}
export const HeaderFiveEl = (props: { attributes: any; children: any }) => {
  return <h5 {...props.attributes}>{props.children}</h5>
}
export const HeaderSixEl = (props: { attributes: any; children: any }) => {
  return <h6 {...props.attributes}>{props.children}</h6>
}
export const Leaf = (props: {
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
