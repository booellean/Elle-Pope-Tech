import React, { Component } from 'react';
import renderFetch from '../../api/render';

class Commit extends Component {
  constructor(props){
    super(props);
    this.state = {
      'repo-info' : this.props.repo[this.props.name]
    }
  }

  componentDidMount(){
    if(this.props.repo[this.props.name] !== undefined){
      this.setState({ 'repo-info' : this.props.repo[this.props.name] });
    }else{
      return renderFetch.renderRepoUrlRequests(this.props.url, 1)
              .then( data =>{
                return this.setState({ 'repo-info': data });
              })
    }
  }

  render(){

   if(!this.state['repo-info']){
     //Put Loading bar here;
    //  return false;
    return(
      <p>Loading</p>
    );
    }else{
      return <p>{this.props.title} : {this.state['repo-info'].length}</p>;
    }
  }
}

export default Commit;