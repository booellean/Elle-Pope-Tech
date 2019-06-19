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
  }

  componentDidMount(){
    // console.log(this.props.staticContext);
  }

  render(){

    return (
      <div className='App'>
        <Header />
        <Switch>
          {routes.map( ({ path, exact, component: C, ...rest} ) => (
            <Route
              key={path}
              path={path}
              exact={exact}
              render={ () => (
              // <C data={this.props.github} {...rest} />
              <C data={this.props.github} {...rest}/>
            )}
            />
          ))}
              {/* <Route exact path='/' render={() => <Main data={this.state.initialData}  title='About' />} />
              <Route path='/repos' render={() => <Main data={this.state.initialData}  title='About' />}  title='Repositories' />}/>
              <Route path='/open-source' render={() => <Main data={this.state.initialData}  title='About' />} title='Open Source'  />}/> */}
            <Redirect to='/404' component={NotFound} />
          </Switch>
        <Footer />
      </div>
    );
  }
}

