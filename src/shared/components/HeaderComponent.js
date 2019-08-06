import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.svg';

export default class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      navOpen: false
    };
  }

  render(){
    return(
      <React.Fragment>
        <header id='header'>
          <img src={logo} alt="Initials of Elle Pope transposed into a butterfly" id="logo"></img>
          <h1>Elle Pope</h1>
          <nav id="site-nav">
            <ul>
              <li>
                <NavLink className='nav-link' to='/'> About</NavLink>
              </li>
              <li>
                <NavLink className='nav-link' to='/repos'> Personal</NavLink>
              </li>
              <li>
                <NavLink className='nav-link' to='/open-source'>Open Source</NavLink>
              </li>
            </ul>
          </nav>
        </header>
      </React.Fragment>
    );
  }
}