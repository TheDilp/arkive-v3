import { createClient } from '@supabase/supabase-js'
import { Document } from '../custom-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const fetchDocuments = async () => {
  let { data: documents, error } = await supabase
    .from('documents')
    .select('id, title, image')
  if (documents) return documents
  if (error) {
    console.log(error)
    return
  }
}

export const fetchSingleDocument = async (id: string) => {
  let { data: document, error } = await supabase
    .from('documents')
    .select('id, title, image, content')
    .eq('id', id)
  if (document) return document
  if (error) {
    console.log(error)
    return
  }
}
