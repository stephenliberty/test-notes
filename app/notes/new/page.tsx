'use client';
import NotesEditor from "@/components/notes/editor";
import {useMutation} from "@apollo/client";
import { useRouter } from 'next/navigation'
import gql from "graphql-tag";

const NEW_NOTE_QUERY = gql`
    mutation NewNote($note: NoteInput) {
        createNote(note: $note) {
            id
        }
    }
`

export default function NewNotesPage() {
  const router = useRouter()
  const [createNote, createRes] = useMutation(NEW_NOTE_QUERY)
  const onSubmit = function (newModel) {
    console.log("Submitting form")
    createNote({
      variables: {note: newModel},
    }).then(() => {
      router.push('/')
    })
  }
  const dataModel = {
    name: '',
    note: ''
  }
  return (
    <>
      <NotesEditor onSubmit={onSubmit} dataModel={dataModel}></NotesEditor>
    </>
  )
}