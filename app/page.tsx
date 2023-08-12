import Link from "next/link";
import NoteListLoader from "@/components/notes/list_loader";
import MainHeader from "@/components/main_header";

export default function Page() {
  return (
    <>
        <MainHeader></MainHeader>
        <NoteListLoader></NoteListLoader>
    </>
  )
}