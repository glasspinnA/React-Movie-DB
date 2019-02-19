import React, { Component } from 'react';
import './App.css';
import MaterialIcon from 'material-icons-react';
import Pagination from "react-js-pagination";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      genreList: [],
      movieList: [],
      isLoading: true,
      movieQuery: undefined,
      movieCategory: undefined,
      genreId: undefined,
      genreName: undefined,
      activePage: 1,
      totalPages: undefined,
      totalResults: 1,
    }

    this.timer = 0
  }

  componentDidMount = async () => {
    await this.fetchGenres()

    if (this.state.movieList.length === 0) {
      this.fetchMovieByGenre(null, 12, "Action")
    }

  }

  /**
   * Function for fetch genres for movies
   */
  fetchGenres = async () => {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=d50ecfa4de79b35a1cc43cc6ddcd1373&language=en-US'
    await fetch(url)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          genreList: result.genres,
          isLoading: false,
        })
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  /**
   * Function for fetch movie by given genre
   */
  fetchMovieByGenre = async (event, genreId, genreName) => {
    this.setState({ activePage: 1, movieList: [], genreName: genreName })

    try {
      event.stopPropagation()
    } catch (error) { }

    const url = "https://api.themoviedb.org/3/discover/movie?api_key=d50ecfa4de79b35a1cc43cc6ddcd1373&language=en-US&with_genres=" + genreId
    await fetch(url)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          movieList: result.results,
          genreId: genreId,
          isLoading: false,
          totalResults: result.total_results,
        })
      })
      .catch((error) => {
        alert(error.message)
      })
  }


  /**
   * Function for fetching movie after movie query
   */
  searchMovie = async (movie) => {
    const movieQuery = movie.target.value

    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(async () => {
      if (movieQuery.length > 1) {
        const url = "https://api.themoviedb.org/3/search/movie?api_key=d50ecfa4de79b35a1cc43cc6ddcd1373&query=" + movieQuery
        await fetch(url)
          .then(res => res.json())
          .then((result) => {
            console.log(result);

            this.setState({
              movieList: result.results,
              isLoading: false,
              totalPages: result.total_pages,
              totalResults: result.total_results
            })
          })
          .catch((error) => {
            alert(error.message)
          })
      }
    }, 300)
  }


  /**
   * Function to handle API call when the user changes page within the movie section
   */
  handlePageChange = async (pageNumber) => {
    this.setState({ activePage: pageNumber });

    const urlSuffix = "https://api.themoviedb.org/3/discover/movie?api_key=d50ecfa4de79b35a1cc43cc6ddcd1373&language=en-US&with_genres="
    const urlPrefix = this.state.genreId + "&page=" + pageNumber
    const url = urlSuffix + urlPrefix

    await fetch(url)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          movieList: result.results,
          isLoading: false,
        })
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  render() {
    const { movieList, genreList, isLoading } = this.state
    if (isLoading) {
      return (
        <div>Loading</div>
      )
    } else {
      return (
        <div className="container">
          <div className="dashboard">
            <div className="search-bar">
              <div className="form">
                <input type="text" placeholder="Search Movie"
                  onChange={(movieInput) => this.searchMovie(movieInput)}
                />
                <span className="search-icon">
                  <MaterialIcon icon="search" invert color="#FFF" />
                </span>
              </div>
            </div>
            <div className="menu">
              <ul>
                {genreList.map(item => (
                  <li key={item.id} onClick={(event) => { this.fetchMovieByGenre(event, item.id, item.name) }}>
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="dashboard-content">
              <h1>You want to see {this.state.genreName} tonight</h1>
              <div className="movie-container">
                {movieList.map(movie => (
                  <div className="dashboard-content-movie" key={movie.id}>
                    <img alt="No Poster Available" src={'http://image.tmdb.org/t/p/w185/' + movie.poster_path} />
                    <br />
                    <p><strong>{movie.title}</strong></p>
                    <p>{movie.vote_average} ⭐</p>
                  </div>
                ))}
              </div>
              <Pagination
                activePage={this.state.activePage}
                totalItemsCount={this.state.totalResults}
                pageRangeDisplayed={3}
                itemsCountPerPage={20}
                onChange={(item) => this.handlePageChange(item)}
                innerClass="pagination"
                activeClass="activeClass"
                itemClass="itemClass"
                linkClass="linkClass"
              />
            </div>
          </div>
        </div>
      )
    }
  }
}

export default App;
