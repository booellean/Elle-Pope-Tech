import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      navOpen: false
    };
  }

  render(){
    return(
      <>
        <header id="header">
          <h1>This is the Header for Elle Tech</h1>
          <nav>
            <ul>
              <li>
                <NavLink className="nav-link" to='/'><span className="fa fa-info fa-lg"></span> Home</NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to='/projects'><span className="fa fa-info fa-lg"></span> Projects</NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to='/projects'><span className="fa fa-info fa-lg"></span> Languages</NavLink>
              </li>
            </ul>
          </nav>
        </header>
      </>
    );
  }
}