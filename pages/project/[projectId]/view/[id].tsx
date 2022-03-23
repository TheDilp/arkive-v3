import { useRouter } from 'next/router'
import EditorComponent from '../../../../components/Editor/EditorComponent'
import { Document } from '../../../../custom-types'
import {
  fetchSingleDocument,
  getDocumentPaths,
} from '../../../../utils/supabaseClient'

type Props = {
  document: Document
}

function ViewPage({ document }: Props) {
  const router = useRouter()
  const { id, projectId } = router.query

  return (
    <article className="flex justify-center" style={{ minHeight: '100vh' }}>
      {document && (
        <div className="flex w-2/3 flex-col rounded">
          <div className="relative h-1/6 w-full">
            <div className="relative z-50 mb-0 flex h-full w-full items-center justify-center">
              <h1 className="text-6xl">
                <b>{document.title}</b>
              </h1>
            </div>
            {/* <Image src={document.image} layout="fill" objectFit="cover" /> */}
          </div>
          <EditorComponent
            content={document.content}
            docId={id as string}
            projectId={projectId as string}
          />
        </div>
      )}
    </article>
  )
}

export async function getStaticPaths() {
  const documents = await getDocumentPaths()
  const paths = documents
    ? documents.map((doc) => ({
        params: { id: doc.id, projectId: doc.project_id },
      }))
    : []
  return {
    paths,
    fallback: false, // false or 'blocking'
  }
}

export async function getStaticProps({ params }: { params: any }) {
  const document = await fetchSingleDocument(params.id)

  return {
    props: { document },
    revalidate: 3600,
    // will be passed to the page component as props
  }
}

export default ViewPage
