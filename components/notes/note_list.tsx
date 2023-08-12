import Link from "next/link";

export default function NoteList({data, selected}) {

  return (
      <div id={"note_list"} className={"col-2"}>
        <div id={"note_list_wrapper"}>
          <div className="list-group">
            {!data || data.length == 0 ? <div>No notes</div> : ''}
            {data.map((note) => {
              const classNames = ["list-group-item"];
              console.log(selected)
              if(selected == note.id) {
                classNames.push('active');
              }
              const frag = (<Link key={note.id} className={classNames.join(" ")} href={"/notes/" + note.id}>
                <div>
                  {note.name}
                  <div className={"small"}>Updated {new Date(note.updated_on).toLocaleString()}</div>
                </div>
                </Link>)

              return frag;
            })}
          </div>
        </div>
      </div>
  )
}