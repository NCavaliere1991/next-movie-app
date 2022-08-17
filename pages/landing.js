import React, { useState, useEffect } from 'react'
import MovieHeading from '../components/MovieHeading'
import MovieList from '../components/MovieList'
import PopularMovieList from '../components/PopularMovieList'
import SearchBar from '../components/SearchBar'
import { supabase } from '../utils/supabaseClient'

function Landing() {
  const [movies, setMovies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [watchlist, setWatchlist] = useState([])
  const person = supabase.auth.user()

  function searchMovie(searchTerm) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=645b84c0424790ef23fda061c7c0aa17&query=${searchTerm}`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (searchTerm) {
          setMovies(data.results)
        }
      })
  }

  async function getWatchlist() {
    const { data, error } = await supabase
      .from('users_watchlists')
      .select('watchlist')
    console.log(data)
  }

  useEffect(() => {
    getWatchlist()
  }, [])

  useEffect(() => {
    searchMovie(searchTerm)
  }, [searchTerm])

  async function addToWatchlist(movie) {
    setWatchlist((prevMovies) => {
      if (!prevMovies.includes(movie)) {
        return [...prevMovies, movie]
      }
    })
    // if (watchlist !== null) {
    //   const { data, error } = await supabase
    //     .from('users_watchlists')
    //     .update({ watchlist: watchlist })
    //     .match({ user_id: person?.id })
    // }
  }

  async function deleteFromWatchlist(movie) {
    setWatchlist((prevMovies) => {
      return prevMovies.filter((film) => {
        return film.id !== movie.id
      })
    })
    // const { data, error } = await supabase
    //   .from('users_watchlists')
    //   .update({ watchlist: watchlist })
    //   .match({ user_id: person?.id })
  }

  async function checkForUser() {
    if (person) {
      const { data, error } = await supabase
        .from('users_watchlists')
        .insert([{ user_id: person?.id }])
    }
  }

  useEffect(() => {
    checkForUser()
  }, [])

  return (
    <div className="bg-main-blue w-screen h-screen">
      <nav className="flex justify-between items-center">
        <MovieHeading text="Find Movies" />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </nav>
      <section className="flex flex-nowrap overflow-x-auto scrollbar-hide bg-main-blue">
        <MovieList
          movies={movies}
          key={movies.id}
          onAdd={addToWatchlist}
          buttonText="Add To WatchList"
        />
      </section>
      <nav>
        <MovieHeading text="Popular Movies" />
      </nav>
      <section className="flex flex-nowrap overflow-x-auto scrollbar-hide bg-main-blue">
        <PopularMovieList
          onAdd={addToWatchlist}
          buttonText="Add To Watchlist"
          seeMoreText="Load More"
        />
      </section>
      <nav className="bg-main-blue">
        <MovieHeading text="Watchlist" />
      </nav>
      <section className="flex flex-nowrap overflow-x-auto scrollbar-hide bg-main-blue">
        <MovieList
          movies={watchlist}
          key={watchlist.id}
          onAdd={deleteFromWatchlist}
          buttonText="Remove from WatchList"
        />
      </section>
    </div>
  )
}

export default Landing
