import { useState, useEffect, useRef } from 'react'
import { API_URL, API_KEY } from '../../../../Config'

const CurrentLanguage = localStorage.getItem('language');

const date = new Date();

function convertDate(date) {
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString();
  const dd = date.getDate().toString();

  const mmChars = mm.split('');
  const ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
}

//custom hook
export const useFetchMovies = () => {
  const [item, setItem] = useState({ Movies: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [year, setYear] = useState('')
  const [sort, setSort] = useState('popularity.desc')
  const [rating, setRating] = useState({ min: 0, max: 10 });
  const [yearRange, setYearRange] = useState({ min: 1980, max: 2020 });
  const [genreID, setGenreID] = useState([]);
  const selectEl = useRef(null);
  const selectElPop = useRef(null);

  const fetchMovies = async endpoint => {
    setError(false)
    setLoading(true)

    const isLoadMore = endpoint.search('page')
    try {
      const result = await (await fetch(endpoint)).json()

      setItem(prev => ({
        ...prev,
        Movies:
          isLoadMore !== -1
            ? [...prev.Movies, ...result.results]
            : [...result.results],
        CurrentPage: result.page,
        totalPages: result.total_pages,
      }))
    } catch (error) {
      setError(true)
    }
    setLoading(false)
  }

  const makeItYear = (event) => {
    setYearRange({ min: 1980, max: 2020 })
    setYear(event.target.value)
    setLoading(false);
  }

  const makeItSort = (event) => {
    setSort(event.target.value)
    setLoading(false);
  }

  const onRatingSliderChange = (value) => {
    setSort('popularity.desc')
    setRating(value);
    setLoading(false);
  };

  const onYearRangeSliderChange = (value) => {
    setYear('');
    selectEl.current.value = '';
    setYearRange(value);
    setLoading(false);
  };


  const handleGenre = (event) => {
    setGenreID(event.target.value);
    setLoading(false);
  };

  const clearFilters = () => {
    selectEl.current.value = '';
    selectElPop.current.value = 'popularity.desc';
    setYear('')
    setGenreID('')
    setRating({ min: 0, max: 10 })
    setYearRange({ min: 1980, max: 2020 })
    setSort('popularity.desc')
    setLoading(false);
  }

  useEffect(() => {
    
    fetchMovies(`${API_URL}discover/tv?api_key=${API_KEY}&with_genres=${genreID}`)
// eslint-disable-next-line 
  }, [CurrentLanguage, year, sort, rating.min, rating.max, yearRange.min, yearRange.max, genreID])

  return [{ item, loading, error, year, sort, rating, yearRange, genreID, selectEl, selectElPop }, fetchMovies, makeItYear, makeItSort, onRatingSliderChange, onYearRangeSliderChange, handleGenre, clearFilters]
}