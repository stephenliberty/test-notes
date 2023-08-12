'use client';
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {useLazyQuery} from "@apollo/client";
import gql from "graphql-tag";

const SEARCH_QUERY = gql`
  query DoSearch($searchStr: String) {
      search(filter: {filter: $searchStr}) {
          id
          name
          updated_on
      }
  }
`

export default function MainHeader() {
  const dropDownMenuRef = useRef(null);
  const [searchStr, setSearchStr] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const [doSearch, searchRes] = useLazyQuery(SEARCH_QUERY, {
    variables: {
      searchStr
    },
    fetchPolicy:"network-only"
  })

  function handleSearch(e) {
    setIsDropdownOpen(true);
    setSearchStr(e.target.value);
  }
  function onBlur(e) {
    timerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 3000)
  }
  useEffect(()=>{
    if(searchStr.length > 0 && isDropdownOpen) {
      doSearch();
    }
    return () => {
      timerRef.current && clearTimeout(timerRef.current);
    }
  }, [searchStr, isDropdownOpen, doSearch])
  return (
    <div className={"row"}>
      <div className="col">
        <Link className="btn btn-outline-dark" aria-current="page" href="/notes/new">New Note</Link>
      </div>
      <div className="col btn-group">
        <input onFocus={handleSearch} onBlur={onBlur} onChange={handleSearch} type="text" className="form-control dropdown-toggle" id="note-search" placeholder="Note Search"/>
        <ul ref={dropDownMenuRef} id={"search_dropdown"} className={"dropdown-menu " + (isDropdownOpen ? 'show' : '')} aria-labelledby="note-search">
          {searchRes.called && !searchRes.loading && (!searchRes.data || !searchRes.data.search || !searchRes.data.search.length) ? <li className={"alert alert-warning"}>No results found</li>: ''}
          {searchRes.data?.search?.map((note) => {
            return (
              <li key={note.id}>
                <Link className="dropdown-item" href={"/notes/" + note.id}>{note.name}</Link>
              </li>)
          })}
        </ul>
      </div>
      <div className="col">
        <button className="btn btn-secondary">Search</button>
      </div>
    </div>
  )
}