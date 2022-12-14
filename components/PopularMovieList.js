import React, { useState, useEffect } from 'react'

function PopularMovieList(props) {
  const imgURL = 'https://image.tmdb.org/t/p/w500'
  const [popularMovies, setPopularMovies] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  useEffect(() => {
    const url =
      'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=645b84c0424790ef23fda061c7c0aa17&page=1'
    showPopularMovies(url)
  }, [])

  function getRating(rating) {
    if (rating >= 8) {
      return 'text-green-500'
    } else if (rating >= 5) {
      return 'text-yellow-500'
    } else {
      return 'text-red-500'
    }
  }

  function handleClick() {
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=645b84c0424790ef23fda061c7c0aa17&page=${
      currentPage + 1
    }`
    showPopularMovies(url)
  }

  async function showPopularMovies(path) {
    fetch(path)
      .then((response) => response.json())
      .then((response) => {
        setPopularMovies([...popularMovies, ...response.results])
        setCurrentPage(response.page)
      })
  }
  console.log(props.watchlist)
  return (
    <>
      <div className="flex items-center">
        {popularMovies.map((movie, index) => (
          <div
            key={movie.id}
            className="m-4 bg-border-blue border-black border-2 relative transition-transform group hover:scale-110 w-[300px]"
          >
            <img
              src={imgURL + movie.poster_path}
              className="w-full"
              alt="movie"
            />
            <div className="bg-black/50 hidden group-hover:flex absolute text-white left-0 right-0 bottom-0 w-full h-full items-center justify-center flex-wrap m-auto px-2">
              <h4 className="overview">{movie.overview}</h4>
              <button
                onClick={() => props.onAdd(movie)}
                disabled={props.watchlist.includes(movie.id)}
                className={`${
                  props.watchlist.includes(movie.id)
                    ? 'bg-main-blue text-yellow-500'
                    : 'bg-yellow-500 text-main-blue'
                } border-violet-400 font-bold rounded-sm p-2`}
              >
                {props.watchlist.includes(movie.id)
                  ? 'Already in watchlist'
                  : 'Add to watchlist'}
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
        <button
          className="bg-yellow-500 border-violet border-2 rounded-sm p-2 text-main-blue cursor-pointer h-1/4 mr-2"
          onClick={handleClick}
        >
          {props.seeMoreText}
        </button>
      </div>
    </>
  )
}

export default PopularMovieList
