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
      <React.Fragment>
        <header id="header">
          <h1>This is the Header for Elle Tech</h1>
          <nav>
            <ul>
              <li>
                <NavLink className="nav-link" to='/'><span className="fa fa-info fa-lg"></span> Home</NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to='/repos'><span className="fa fa-info fa-lg"></span> Repos</NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to='/open-source'><span className="fa fa-info fa-lg"></span> Open Source</NavLink>
              </li>
            </ul>
          </nav>
        </header>
      </React.Fragment>
    );
  }
}