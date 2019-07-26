import React, { Component } from 'react';
import './App.css';
import Header from './components/HeaderComponent';
import Footer from './components/FooterComponent';
import Main from './components/MainComponent';
import NotFound from './components/NotFoundComponent';
import { Switch, Route, Redirect} from 'react-router-dom';
import routes from './routes';
import * as api from '../client/api';
import logo from './logo.svg';

export default class App extends Component {
  constructor(props){
    super(props);

    let data, loc;

    if(this.props.github){
      data = this.props.github;
      loc = this.props.location.split('/').pop();
    }else{
      data = window.initialData;
      loc = window.location.pathname;
      console.log(data, loc);
      delete window.initialData;
    }

    this.state = {
      '/': null,
      'repos': null,
      'open-source': null,
      'repo': null,
      'org': null
    }

    if(this.state[loc] === null){
      console.log("name method called");
      return this.state[loc] = data;
    }else if(!this.state[loc] && this.props.location.search('repos') > -1){
      return this.state['repo'] = data;
    }else if(!this.state[loc] && this.props.location.search('open-source') > -1){
      return this.state['org'] = data;
    }else{
      // console.log("updateTheState called");
      // return this.updateTheState(null, data);
    }
  }

  //update state from children that are rendered for the first time. Avoids unnecessary loading
  updateTheState(name, newState){
    //if name is null, this is all the combined data from repos and must be split
    if(name === null){
      let arr = newState.allData;

      let personalRepos = arr.map( item => item.owner.login === 'booellean' && item.fork === false && item.private !== true);

      let contribRepos = arr.map( item => item.owner.login !== 'booellean' || item.fork === true);

      this.updateTheState('repos', personalRepos);
      this.updateTheState('open-source', contribRepos);
    }else{
      this.setState({
        [name] : newState
      })
    }
  }

  render(){

    return (
      <div className='App'>
        <Header />
        <Switch>
          {routes.map( ({ path, exact, component: C, ...rest, name} ) => (
            <Route
              key={path}
              path={path}
              exact={exact}
              render={ () => (
                // <C data={this.state[name] || this.props.github} {...rest} stateName={name}/>
                <C data={this.state[name]}
                  {...rest}
                  stateName={name}
                  updateTheState={this.updateTheState.bind(this)}
                  />
                )}
              />
            ))}
            <Redirect to='/404' component={NotFound} />
          </Switch>
        <Footer />
      </div>
    );
  }
}

