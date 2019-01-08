import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MaterialIcon, {colorPalette} from 'material-icons-react';


class App extends Component {

  constructor(props){
    super(props)

  }

  componentDidMount = async() =>{
    await this.fetchGenres()
  }

  fetchGenres = () =>{
    
  }


  render() {
    return (
      <div class="container">
        <div class="dashboard">
          <div class="search-bar">
            <div class="form">
              <input type="text" placeholder="Search Movie" />
              <span class="search-icon">
                <MaterialIcon icon="search" invert color="#FFF"/>
              </span>
            </div>
          </div>
          <div class="menu">
            <ul>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
            </ul>
          </div>
          <div class="dashboard-content">
            <div class="movie-container">
              <div class="dashboard-content-movie">
                <img src="https://facebook.github.io/react-native/docs/assets/favicon.png" />
                <br/>
                <span><strong>Text</strong></span>
                <br/>
                <span>Mö</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
