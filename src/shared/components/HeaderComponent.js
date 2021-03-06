import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../logo.svg';

export default class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      isMobile: false
    }
  }


  componentWillReceiveProps() {
    if(this.props.screenSize <= 720 || null){
      this.setState({ isMobile : true});
    }else{
      this.setState({ open : false, isMobile : false});
    }
  }

  handleClick(){
    this.setState({open:!this.state.open});
  }

  render(){

    return(
      <React.Fragment>
        <header id='header'>
          <img src={logo} alt="Initials of Elle Pope transposed into a butterfly" id="logo"></img>
          <h1>Elle Pope</h1>
          {/* Hamburger Menu */}
          <div id="hamburger" className={this.state.open ? 'clickEvent' : null} onClick={()=> {this.handleClick()}}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <nav id="site-nav" className={this.state.open ? 'open' : null}>
            <ul className={this.props.screenSize >= 720 ? 'wide-screen' : 'small-screen'}>
              <li>
                <NavLink className='nav-link' to='/' onClick={()=> {this.handleClick()}}> About</NavLink>
              </li>
              <li>
                <NavLink className='nav-link' to='/repos' onClick={()=> {this.handleClick()}}> Personal</NavLink>
              </li>
              <li>
                <NavLink className='nav-link' to='/open-source' onClick={()=> {this.handleClick()}}>Open Source</NavLink>
              </li>
            </ul>
          </nav>
        </header>
      </React.Fragment>
    );
  }
}