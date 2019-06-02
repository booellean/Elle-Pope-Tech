import React, { Component } from 'react';
import Header from './components/HeaderComponent';
import Footer from './components/FooterComponent';
import Main from './components/MainComponent';
import NotFound from './components/NotFoundComponent';
import { Switch, Route, Redirect} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      github: null
    };
  }

  componentDidMount(){
    this.getData();
  }

  getData() {
    return(
      fetch('https://api.github.com/users/booellean/repos', {
        method: 'GET',
        mode: 'cors'
      })
      .then( (res) =>{ return res.json(); })
      .then( (data) =>{ return data.filter( item => item.fork === true ); })
      .then( (data) =>{
        this.setState({
          github: JSON.stringify(data)
        });
        console.log('loaded');
      })
      .catch( (error) =>{
        return `${error}: Github Repos cannot be fetched at this time!`
      })
    );
  }

  render(){
    return (
      <div className="App">
        <Header />
        <Switch>
              <Route exact path='/' component={Main} />
              <Route exact path='/projects' render={() => <Main data={this.state.github}/>} />
              <Route exact path='/dev' render={() => <Main data={this.state.github}/>}  />
              <Route exact path='/software' render={() => <Main data={this.state.github}/>} />
              <Redirect to="/404" component={NotFound} />
          </Switch>
        <Footer />
      </div>
    );
  }
}

