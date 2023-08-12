'use client';
import NoteListLoader from "@/components/notes/list_loader";
import MainHeader from "@/components/main_header";

export default function Page({ params }) {
  console.log(params)
  return (
    <>
      <MainHeader></MainHeader>
      <NoteListLoader selected={params.noteId}></NoteListLoader>
    </>
  )
}