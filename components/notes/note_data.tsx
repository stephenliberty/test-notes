import Link from "next/link";
import gql from "graphql-tag";
import {useLazyQuery, useMutation} from "@apollo/client";
import {useRouter} from "next/navigation";

const DELETE_NOTE_QUERY = gql`
    mutation DeleteNote($id: String) {
        deleteNote(id: $id)
    }
`;

export default function NoteDataDisplay({note}) {
  const [runDeleteMutation] = useMutation(DELETE_NOTE_QUERY, {
    variables: {id: note.id},
  })
  const router = useRouter();
  function handleDelete() {
    if(confirm("Are you sure?")) {
      console.log("Delete the thing")
      runDeleteMutation().then(() => {
        router.push('/');
      })
    }
  }

  return (
    <div className={"col-10"}>
      <div>
        <Link className={"btn btn-outline-dark"} href={"/notes/" + note.id + "/edit"}>Edit</Link>
        <button onClick={handleDelete} className={"btn btn-warning"}>Delete</button>
      </div>
      <div>
        <div className={"m-3"}><strong>Note Name</strong> {note.name}</div>
        <div className={"m-3"}>{note.note}</div>
        <div className={"m-3"}><small>Last Updated{note.updated_on.toLocaleString()}</small></div>
      </div>
    </div>
  )
}