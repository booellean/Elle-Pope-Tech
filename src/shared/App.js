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

  componentDidMount(){
    console.log();
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
              <Route exact path='/' render={() => <Main data={...data}  title='About' />} />
              <Route path='/repos' render={() => <Main data={...(data.filter(  item => item.owner.login === 'booellean'))}  title='Repositories' />}/>
              <Route path='/open-source' render={() => <Main data={...(data.filter( item => item.owner.login !== 'booellean'))} title='Open Source'  />}/>
              <Redirect to='/404' component={NotFound} />
          </Switch>
        <Footer />
      </div>
    );
  }
}


