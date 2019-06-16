import React, { Component } from 'react';
import Page from './PageComponent';

class Main extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log(this.props.data);
  }

  render(){

    const listItems = this.props.data.map(  item => {
        return(
          // <li>{item.owner.login}</li>
          <li>{JSON.stringify(item)}</li>
        );
      });

    return(
      <React.Fragment>
        <main id='main'>
        <header id='page-header'>
          <h2>This is the {this.props.title} Page</h2>
          <ul>
            {listItems}
          </ul>
        </header>
          <Page />
        </main>
      </React.Fragment>
    );
  }
}

export default Main;