import React, { Component } from 'react';

export default class Footer extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
    // Form taken from https://ciunkos.com/creating-contact-forms-with-nodemailer-and-react
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
          <form method="POST">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" />

            <label htmlFor="email">Email</label>
            <input type="email" name="email" />

            <label htmlFor="message">Message</label>
            <textarea name="message" rows="3"></textarea>

            <input type="submit" />
          </form>
        </footer>
      </React.Fragment>
    );
  }
}