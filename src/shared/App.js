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

    let data, keysArr;

    if(this.props.github){
      data = this.props.github;
      keysArr = Object.keys(data);
      // console.log(data, keysArr);
    }else{
      data = JSON.parse(window.initialData);
      keysArr = Object.keys(data[0]);

      delete window.initialData;
    }

    this.state = {
      'home': null,
      'repos': null,
      'open-source': null,
      'repo': null,
      'org': null
    }

    keysArr.forEach( loc =>{
      if(this.state[loc] === null){
        // console.log("name method called");
        return this.state[loc] = data[loc];
      }else{
        console.error("Error: No state found");
      }
    });
  }

  //update state from children that are rendered for the first time. Avoids unnecessary loading
  updateTheState(data){
    let keysArr = Object.keys(data);
    keysArr.forEach( key =>{
      this.setState({
        [key] : data[key]
      })
      // console.log(this.state[key]);
    })
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

