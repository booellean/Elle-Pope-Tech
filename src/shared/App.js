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
  updateInitialState(getDat){
    return getDat()
    .then( data =>{
      return JSON.parse(data);
    })
    .then( data =>{
      let keysArr = Object.keys(data);
      keysArr.forEach( key =>{
        this.setState({
          [key] : data[key]
        })
      })
      return data;
    });
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

  updatePartofStateArray(getDat, url, name, repo, stateName){
    //renderFetch.renderRepoUrlRequests(), this.props.url, this.props.name, this.props.repo
    // return renderFetch.renderRepoUrlRequests(this.props.url, 1, this.props.name)
    return getDat(url, 1, name)
      .then( data =>{
        let arr = this.state[stateName].repos;
        if(!this.state[stateName]['languages-in-repos']){
          this.state[stateName]['languages-in-repos'] = {}
        }
        let stateCopy = this.state[stateName]['languages-in-repos'];

        if(Array.isArray(this.state[stateName].repos)){
          //Find the index of the array object that needs updating

          //if this is for open-source state
          if(arr[0].repos){
            arr.forEach( org =>{
              let index = org.repos.indexOf(repo);
              if(index > -1){
                //Count languages if returning languages
                if(name === 'total_languages'){
                  let keys = Object.keys(data[0]);

                  keys.forEach( key =>{
                    stateCopy[key] = (stateCopy[key] +1) || 1;
                  })
                  if( (arr.indexOf(org) === arr.length - 1) && (org.repos.indexOf(repo) === org.repos.length - 1) ){
                    //TODO: change this to a proper setState();
                    this.state[stateName]['languages-in-repos'] = stateCopy;
                  }
                }
                org.repos[index][name] = data;
              }
            })
          }else{
            let index = arr.indexOf(repo);

            if(name === 'total_languages'){
              let keys = Object.keys(data[0]);

              keys.forEach( key =>{
                stateCopy[key] = (stateCopy[key] +1) || 1;
              })
              if( index === (arr.length - 1) ){
                //TODO: change this to a proper setState();
                this.state[stateName]['languages-in-repos'] = stateCopy;
              }
            }
            //using a combination of index, state name, and the new name we are adding to the state object, we set the state for future rendering.
            arr[index][name] = data;
          }
        }else{
          this.state[stateName][name] = data;
        }
        return({languages: stateCopy, data: data});
      })

    //if new object state is part of an array....
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

