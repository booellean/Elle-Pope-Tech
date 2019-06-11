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
    return (
      <div className='App'>
        <Header />
        <Switch>
              <Route exact path='/' render={() => <Main data={this.props.github}  title='Repositories' />} />
              <Route path='/repos' render={() => <Main data={JSON.stringify(JSON.parse(this.props.github).filter(  item => item.owner.login === 'booellean'))}  title='Repositories' />}/>
              <Route path='/open-source' render={() => <Main data={JSON.stringify(JSON.parse(this.props.github).filter( item => item.owner.login !== 'booellean'))} title='Open Source'  />}/>
              <Redirect to='/404' component={NotFound} />
          </Switch>
        <Footer />
      </div>
    );
  }
}


