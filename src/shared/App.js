import React, { Component } from 'react';
import './App.css';
import Header from './components/HeaderComponent';
import Footer from './components/FooterComponent';
import PersonalRepo from './components/PersonalRepoComponent';
import ContribRepo from './components/ContribRepoComponent';
import Home from './components/HomeComponent';
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
    //check if open-source
    // if(this.state[stateName][0].repos){
    //   this.state[stateName].repos.forEach( org =>{
    //     let index = org.repos.indexOf(repo);
    //     if(index > -1){
    //       return org.repos[index][name] = data;
    //     }
    //   })
    // }
    return this.state[stateName][name] = data;
  }

  updatePartofStateArray(data, name, repo, stateName){
    //if new object state is part of an array....
    if(Array.isArray(this.state[stateName].repos)){
      //Find the index of the array object that needs updating
      let arr = this.state[stateName].repos

      //if this is for open-source state
      if(arr[0].repos){
        arr.forEach( org =>{
          let index = org.repos.indexOf(repo);
          if(index > -1){
            return org.repos[index][name] = data;
          }
        })
      }else{
        let index = arr.indexOf(repo);

        //using a combination of index, state name, and the new name we are adding to the state object, we set the state for future rendering.
        return arr[index][name] = data;
      }

    }else{
      return this.state[stateName][name] = data;
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
                  updatePartofStateArray={this.updatePartofStateArray.bind(this)}
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

