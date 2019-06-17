import React, { Component } from 'react';
import './App.css';
import Header from './components/HeaderComponent';
import Footer from './components/FooterComponent';
import Main from './components/MainComponent';
import NotFound from './components/NotFoundComponent';
import { Switch, Route, Redirect} from 'react-router-dom';
import * as api from '../client/api';
import logo from './logo.svg';

export default class App extends Component {
  constructor(props){
    super(props);
  }

  fetchUserStats = () =>{
    return api.fetchUserStats();
  }

  render(){
    let data;
    if(this.props.github){
      data = JSON.parse(this.props.github);
    }
    return (
      <div className='App'>
        <Header />
        <Switch>
              <Route exact path='/' render={() => <Main data={this.fetchUserStats}  title='About' />} />
              <Route path='/repos' render={() => <Main data={data}  title='About' />}  title='Repositories' />}/>
              <Route path='/open-source' render={() => <Main data={data}  title='About' />} title='Open Source'  />}/>
              <Redirect to='/404' component={NotFound} />
          </Switch>
        <Footer />
      </div>
    );
  }
}


