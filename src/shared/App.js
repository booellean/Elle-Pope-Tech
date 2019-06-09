import React, { Component } from 'react';
import './App.css';
import Header from './components/HeaderComponent';
import Footer from './components/FooterComponent';
import Main from './components/MainComponent';
import NotFound from './components/NotFoundComponent';
import { Switch, Route, Redirect} from 'react-router-dom';
import logo from './logo.svg';

export default class App extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="App">
        <Header />
        <Switch>
              <Route exact path='/' component={Main} />
              <Route exact path='/repos' render={() => <Main data={this.props.github}  title='Repositories' />}/>
              <Route exact path='/open-source' render={() => <Main data={this.props.github} title='Open Source'  />}/>
              <Redirect to="/404" component={NotFound} />
          </Switch>
        <Footer />
      </div>
    );
  }
}


