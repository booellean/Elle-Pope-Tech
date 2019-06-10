import React, { Component } from 'react';

export default class Footer extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
    return(
      <React.Fragment>
        <footer id='footer'>
          <small>copyright information here</small>
          <nav id='social-links'>
            <ul>
              <li>
                <a className='social-link' href='#github'> Github</a>
              </li>
              <li>
                <a className='social-link' href='#twitter'> LinkedIn</a>
              </li>
              <li>
                <a className='social-link' href='#twitter'> Twitter</a>
              </li>
              <li>
                <a className='social-link' href='#twitter'> Itch.io</a>
              </li>
            </ul>
          </nav>
        </footer>
      </React.Fragment>
    );
  }
}