import React from 'react'

function MovieHeading(props) {
  return (
    <div className="heading">
      <h2 className="text-3xl text-white ml-4">{props.text}</h2>
    </div>
  )
}

export default MovieHeading
