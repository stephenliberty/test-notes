'use client';

import {useLazyQuery, useQuery} from "@apollo/client";
import gql from "graphql-tag";
import NoteList from "@/components/notes/note_list";
import NoteDataDisplay from "@/components/notes/note_data";
import {useEffect} from "react";

const GET_LIST = gql`
    query GetNoteList {
        list {
            id
            name
            updated_on
        }
    }
`;
const GET_NOTE = gql`
    query GetNote($id: String) {
        note(id: $id) {
            id
            name
            note
            created_on
            updated_on
        }
    }
`

export default function NoteListLoader({selected}) {
  const list = useQuery(GET_LIST, {
    fetchPolicy:"cache-and-network"
  });
  const [getNote, note] = useLazyQuery(GET_NOTE,
    {variables: {id: selected}, fetchPolicy:"cache-and-network"});

  useEffect(() => {
    if(selected) {
      getNote()
    }
  }, [getNote, selected]);


  const loadingFragment = (
    <div className={"col-12 g-4 align-items-center justify-content-center d-flex"}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  const errorFragment = (
    <div className={"alert alert-danger"}>
      Failed to retrieve data
    </div>
  )
  return (
    <>
    <div className={"row"} id={"note_data_container"}>
      <div className={"col-12 row"} id={"note_list_container"}>
      {list.loading && loadingFragment}
      {!list.loading && list.error && errorFragment}
      {!list.loading && list.data && <NoteList selected={selected} data={list.data.list}></NoteList> }
      {!note.loading && selected && note.data && <NoteDataDisplay note={note.data.note}></NoteDataDisplay>}
      </div>
    </div>

    </>
  )
}