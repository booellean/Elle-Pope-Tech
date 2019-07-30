import React, { Component } from 'react';
import './App.css';
import Header from './components/HeaderComponent';
import Footer from './components/FooterComponent';
import PersonalRepo from './components/PersonalRepoComponent';
import ContribRepo from './components/ContribRepoComponent';
import NotFound from './components/NotFoundComponent';
import { Switch, Route, Redirect} from 'react-router-dom';
import routes from './routes';
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
        return this.state[loc] = data[loc];
      }else{
        console.error("Error: No state found");
      }
    });
  }

  //update state from children that are rendered for the first time. Avoids unnecessary loading
  updateInitialState(data){
    let keysArr = Object.keys(data);
    keysArr.forEach( key =>{
      this.setState({
        [key] : data[key]
      })
    })
  }

  updatePartofState(data, name, repo, stateName){
    //if new object state is part of an array....
    if( (stateName === 'repos' || stateName === 'open-source') && name === 'total_languages'){
      let keys = Object.keys(data[0]);
      if(!this.state[stateName]['languages-in-repo']){
        this.state[stateName]['languages-in-repo'] = {};
      }
      keys.forEach( key =>{
        this.state[stateName]['languages-in-repo'][key] = (++this.state[stateName]['languages-in-repo'][key]) || 1;
      })
    }

    if(Array.isArray(this.state[stateName])){
      //Find the index of the array object that needs updating
      let index = this.state[stateName].indexOf(repo);

      //using a combination of index, state name, and the new name we are adding to the state object, we set the state for future rendering.
      this.state[stateName][index][name] = data;

      // console.log(index, this.state[stateName].length)
      // if(index === this.state[stateName].length - 1){
      //   console.log(`state will be updated`);
      //   let stateCopy = this.state[stateName];
      //   this.setState({ [stateName] : stateCopy })
      // }
    //else new object state is just a single object that needs updating
    }else{
      this.state[stateName][name] = data;
      // let stateCopy = this.state[stateName];
      // this.setState({ [stateName] : stateCopy })
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
                  updateInitialState={this.updateInitialState.bind(this)}
                  updatePartofState={this.updatePartofState.bind(this)}
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

