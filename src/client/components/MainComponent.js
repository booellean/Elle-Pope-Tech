import React, { Component } from 'react';
import Page from './PageComponent';

class Main extends Component {
  constructor(props){
    super(props);
  }

  render(){

    // const listItems = this.props.data.map(  item => {
    //     return(
    //       <li>{item.language}</li>
    //     );
    //   });

    return(
      <>
        <main id="main">
        <header id="page-header">
          <h2>This is the {this.props.title} Page</h2>
          <ul>
            {/* {listItems} */}
          </ul>
        </header>
          <Page />
        </main>
      </>
    );
  }
}

export default Main;