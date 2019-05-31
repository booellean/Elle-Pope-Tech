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
    };
  }

  render(){
    return (
      <div className="App">
        <Header />
        <Switch>
              <Route exact path='/' component={Main} />
              <Route exact path='/projects' render={() => <Main />} />
              <Route exact path='/dev' render={() => <Main />}  />
              <Route exact path='/software' render={() => <Main />} />
              <Redirect to="/404" component={NotFound} />
          </Switch>
        <Footer />
      </div>
    );
  }
}

