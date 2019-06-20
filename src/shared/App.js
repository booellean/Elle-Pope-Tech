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
      delete window.initialData;
    }

    this.state = {
      '': '_blank',
      'repos': '_blank',
      'open-source': '_blank',
      'repo': '_blank',
      'org': '_blank'
    }

    if(this.state[loc] && this.state[loc] === '_blank'){
      this.state[loc] = data;
    }else if(!this.state[loc] && this.props.location.search('repos') > -1){
      this.state['repo'] = data;
    }else if(!this.state[loc] && this.props.location.search('open-source') > -1){
      this.state['org'] = data;
    }else{
      console.log(`error: No state found for these props!`);
    }
  }

  setTheState(name, func){
    this.setState({ [name] : this.data })
    return data;
  }

  componentDidMount(){
    // console.log(this.props.staticContext);
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
              <C data={this.state[name] === '_blank' ? this.setTheState(name, ...rest) : this.state[name] } loc={this.props.location} {...rest}/>
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

