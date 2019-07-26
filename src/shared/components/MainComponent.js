import React, { Component } from 'react';
import Page from './PageComponent';

class Main extends Component {
  constructor(props){
    super(props);

    this.state = {
      info : this.props.data
    }
  }

  componentDidMount(){
    if(this.props.data !== null){
      // return this.setState({ info: this.props.data });
      this.setState({ info: this.props.data });
      return console.log(this.state.info);
    }else{
      return this.props.fetchInitialData()
      .then( data =>{
        let newDat = JSON.parse(data);
        this.setState({ info: newDat[this.props.name] });
        this.props.updateTheState(newDat);
        return console.log(this.state.info);
      });
    }
  }

  render(){

   if(!this.state.info){
     //Put Loading bar here;
     return false;
   }else{
    const listItems = this.state.info.map( item => {
        return(
          <li key={item.id}>{`${JSON.stringify(item.id)}: ${JSON.stringify(item)}`}</li>
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
}

export default Main;