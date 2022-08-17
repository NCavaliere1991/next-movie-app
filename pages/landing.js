import React, { useState, useEffect } from 'react'
import MovieHeading from '../components/MovieHeading'
import MovieList from '../components/MovieList'
import PopularMovieList from '../components/PopularMovieList'
import SearchBar from '../components/SearchBar'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

function Landing() {
  const [movies, setMovies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [watchlist, setWatchlist] = useState([])
  const person = supabase.auth.user()
  const router = useRouter()

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
    let movies = []
    const { data, error } = await supabase
      .from('watchlists')
      .select('movie_id')
      .match({ user_id: person.id })

    if (data) {
      for (const movie of data) {
        const url = `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=645b84c0424790ef23fda061c7c0aa17`
        await fetch(url)
          .then((res) => res.json())
          .then((result) => movies.push(result))
      }
      setWatchlist(movies)
    }
  }

  useEffect(() => {
    if (person) {
      const onPageLoad = () => {
        getWatchlist()
      }
      if (document.readyState === 'complete') {
        onPageLoad()
      } else {
        window.addEventListener('load', onPageLoad)
        // Remove the event listener when component unmounts
        return () => window.removeEventListener('load', onPageLoad)
      }
    } else {
      router.push('/')
    }
  }, [])

  useEffect(() => {
    searchMovie(searchTerm)
  }, [searchTerm])

  async function addToWatchlist(movie) {
    const { data, error } = await supabase
      .from('watchlists')
      .insert({ movie_id: movie.id, user_id: person.id })
    getWatchlist()
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    router.push('/sign-in')
  }

  async function deleteFromWatchlist(movie) {
    setWatchlist((prevMovies) => {
      return prevMovies.filter((film) => {
        return film.id !== movie.id
      })
    })
    const { data, error } = await supabase
      .from('watchlists')
      .delete()
      .match({ movie_id: movie.id })
  }

  return (
    <div className="bg-main-blue w-screen h-screen">
      <div className="text-right mr-8 pt-8">
        <button
          onClick={signOut}
          className="border px-4 py-2 bg-red-500 text-white"
        >
          Sign out
        </button>
      </div>
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
