'use client';
import NotesEditor from "@/components/notes/editor";
import {useMutation, useQuery} from "@apollo/client";
import gql from "graphql-tag";
import { useRouter } from 'next/navigation'

const GET_NOTE_QUERY = gql`
    query GetNote($id: String) {
        note(id: $id) {
            id
            name
            note
            created_on
            updated_on
        }
    }
`;

const UPDATE_NOTE_QUERY = gql`
    mutation UpdateNote($note: NoteInput) {
        updateNote(note: $note) {
            id
        }
    }
`;


export default function EditNotePage({ params }: { params: { noteId: string } }) {
  const [updateNote, updateRes] = useMutation(UPDATE_NOTE_QUERY)
  const router = useRouter();
  const fetchRes = useQuery(GET_NOTE_QUERY, {variables: {id: params.noteId}})
  const onSubmit = function (newModel) {
    console.log("Submitting form")
    updateNote({
      variables: {
        note: newModel
      }
    }).then(() => {
      router.push('/notes/' + newModel.id)
    })
  }
  
  return (
    <>
      {fetchRes.loading && <span>Loading...</span>}
      {!fetchRes.loading && fetchRes.data && <NotesEditor onSubmit={onSubmit} dataModel={fetchRes.data.note}></NotesEditor>}
    </>
  )
}