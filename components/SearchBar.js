import React from 'react'

function SearchBar(props) {
  return (
    <form>
      <input
        className="px-2 py-2 rounded-md border-2 mt-7 mr-10 bg-transparent border-border-blue text-white placeholder:text-white focus:bg-border-blue"
        value={props.value}
        onChange={(event) => props.setSearchTerm(event.target.value)}
        placeholder="Search"
      ></input>
    </form>
  )
}

export default SearchBar
