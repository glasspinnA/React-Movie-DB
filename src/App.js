import React, { Component } from 'react';
import './App.css';
import MaterialIcon from 'material-icons-react';
import Fade from 'react-reveal/Fade';


class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      genreList: [],
      movieList: [],
      isLoading: true,
      isEmpty: true,
      movieQuery: undefined,
      movieCategory: undefined,
    }

    this.timer = 0
  }

  componentDidMount = async() =>{
    await this.fetchGenres()
  }

  /**
   * Function for fetch genres for movies
   */
  fetchGenres = async () => {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=d50ecfa4de79b35a1cc43cc6ddcd1373&language=en-US'
    await fetch(url)
    .then(res => res.json())
    .then((result) => {
      console.log(result.genres);
      
      this.setState({
        genreList: result.genres,
        isLoading: false,
        isEmpty: true,
      })
    })
    .catch((error) => {
      alert(error.message)
    })
  }

  /**
   * Function for fetch movie by given genre
   */
  fetchMovieByGenre = async (event, genreId) => {
    event.stopPropagation()

    this.setState({movieList:[]})

    const url = "https://api.themoviedb.org/3/discover/movie?api_key=d50ecfa4de79b35a1cc43cc6ddcd1373&language=en-US&with_genres=" + genreId

    await fetch(url)
    .then(res => res.json())
    .then((result) => {            
      this.setState({
        movieList: result.results,
        isLoading:false,
        isEmpty:false,
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
    

    if(this.timer){
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(async () =>{
      const url = "https://api.themoviedb.org/3/search/movie?api_key=d50ecfa4de79b35a1cc43cc6ddcd1373&query=" + movieQuery
      await fetch(url)
        .then(res => res.json())
        .then((result) => { 
          console.log(result);
                     
          this.setState({
            movieList: result.results,
            isLoading:false,
            isEmpty:false
          })
        })
        .catch((error) => {
          alert(error.message)
        })
    },300)
  }


  render() {
    const {movieList,genreList, isLoading} = this.state
    if(isLoading){
      return(
        <div>Loading</div>
      )
    }else{
      return(
      <div class="container">
        <div class="dashboard">
          <div class="search-bar">
            <div class="form">
              <input type="text" placeholder="Search Movie" 
              onChange={(movieInput) => this.searchMovie(movieInput)}
              />
              <span class="search-icon">
                <MaterialIcon icon="search" invert color="#FFF"/>
              </span>
            </div>
          </div>
          <div class="menu">
            <ul>
              {genreList.map(item => (
                <li key={item.id} onClick={(event) => {this.fetchMovieByGenre(event,item.id)}}>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
          <div class="dashboard-content">
            <div class="movie-container">
              {movieList.map(movie => (
                <div class="dashboard-content-movie" key={movie.id}>
                  <Fade left>
                    <img alt="No Poster Available" src={'http://image.tmdb.org/t/p/w185/'+ movie.poster_path} />
                    <br/>
                    <p><strong>{movie.title}</strong></p>
                    <br/>
                    <p>{movie.vote_average}</p>
                    <MaterialIcon icon="star" invert color="yellow"/>
                  </Fade>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )
    }
  }
}

export default App;
