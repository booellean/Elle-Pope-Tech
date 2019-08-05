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
          <nav id='social-links'>
            <ul>
              <li>
                <a className='social-link' href='https://github.com/booellean' target="_blank"><i class="fab fa-github"></i></a>
              </li>
              <li>
                <a className='social-link' href='https://www.linkedin.com/in/elle-pope-dev/' target="_blank"><i class="fab fa-linkedin"></i></a>
              </li>
              <li>
                <a className='social-link' href='https://twitter.com/booellean' target="_blank"><i class="fab fa-twitter"></i></a>
              </li>
              <li>
                <a className='social-link' href='https://itch.io/profile/booellean' target="_blank"><i class="fab fa-itch-io"></i></a>
              </li>
            </ul>
          </nav>
          <form id="contact" method="POST">
            <div role="group" aria-labelledby="legend">
              <legend id="legend">Contact</legend>
              <label htmlFor="name">Name</label>
              <input type="text" name="name" />

              <label htmlFor="email">Email</label>
              <input type="email" name="email" />

              <label htmlFor="message">Message</label>
              <textarea name="message"></textarea>

              <input type="submit" />
            </div>
          </form>
          <small id="copyright">copyright information here</small>
        </footer>
      </React.Fragment>
    );
  }
}