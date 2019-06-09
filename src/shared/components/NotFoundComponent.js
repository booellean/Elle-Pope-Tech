import React, { Component } from 'react';

export default class NotFound extends Component {
  constructor(props){
    super(props);
    this.state = {
      navOpen: false
    };
  }

  render(){
    return(
      <React.Fragment>
        <p>404 Not Found!</p>
      </React.Fragment>
    );
  }
}