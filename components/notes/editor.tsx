'use client';
import Link from "next/link";
import {ChangeEvent, useState} from "react";

export default function NotesEditor({onSubmit, dataModel}) {
  const [model, setModel] = useState({
    name: dataModel.name,
    note: dataModel.note,
    id: dataModel.id
  })

  function handleSubmit(e:SubmitEvent) {
    e.preventDefault();
    onSubmit(model);
  }

  const onChange = (propName:String, propValue:String) => {
    const newState = {...model}
    newState[propName] = propValue;
    setModel(newState);
  }

  function onFocus(e) {
    e.target.className = e.target.className + " dirty"
  }

  return (
    <>
      <div className={"row"} style={{"clear": "both"}}>
        <div className="col">
          <Link href="/">Cancel</Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="row">
        <div className="col-12">
          <label htmlFor="inputNoteName">Note Name</label>
          <input onChange={(e) => onChange('name', e.target.value)} onFocus={onFocus} value={model.name} maxLength={50} required type="text" className="form-control" id="inputNoteName"/>
        </div>
        <div className="col-12">
          <label htmlFor="inputNoteContent">Note Content</label>
          <textarea onChange={(e) => onChange('note', e.target.value)} onFocus={onFocus} value={model.note} required minLength={20} maxLength={200} type="text" className="form-control" id="inputNoteContent" rows="5"></textarea>
        </div>
        <div className="col-12">
          <button className={"btn btn-primary"}>Save</button>
        </div>
      </form>
    </>
  );
};