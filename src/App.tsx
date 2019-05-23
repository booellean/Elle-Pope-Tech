import React, { Component } from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import Footer from './components/FooterComponent';
import Header from './components/HeaderComponent';
import Main from './components/MainComponent';
import logo from './logo.svg';
import './App.css';

interface RouteProps extends RouteComponentProps<any>{}

export default class App extends React.PureComponent {
  constructor(props: RouteProps){
    super(props)
  }
  public render(): React.ReactNode {
    return (
      <div className="App">
        <Header />
          <Main params={this.props.match.params }>
            <p>Put a bunch of seo stuff in here for now</p>
          </Main>
        <Footer />
      </div>
    );
  }
}