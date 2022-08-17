import React from 'react'

function MovieList(props) {
  const imgURL = 'https://image.tmdb.org/t/p/w500'

  function getRating(rating) {
    if (rating >= 8) {
      return 'green'
    } else if (rating >= 5) {
      return 'yellow'
    } else {
      return 'red'
    }
  }

  return (
    <>
      <div className="flex items-center bg-main-blue ">
        {props.movies.map((movie, index) => (
          <div
            key={movie.id}
            className="m-4 bg-border-blue border-black border-2 relative transition-transform group hover:scale-110 w-[300px]"
          >
            <img src={imgURL + movie.poster_path} alt="movie" />
            <div className="bg-black/50 hidden group-hover:flex absolute text-white left-0 right-0 bottom-0 w-full h-full items-center justify-center flex-wrap m-auto px-2">
              <h4 className="overview">{movie.overview}</h4>
              <button
                onClick={() => props.onAdd(movie)}
                className="addButton bg-yellow-500 border-violet-400 rounded-sm text-main-blue p-2"
              >
                {props.buttonText}
              </button>
            </div>
            <div className="flex items-center justify-between mb-0 text-yellow-500 p-4">
              <h3>{movie.title}</h3>
              <span
                className={`${getRating(movie.vote_average)} bg-main-blue p-2`}
              >
                {movie.vote_average}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default MovieList
