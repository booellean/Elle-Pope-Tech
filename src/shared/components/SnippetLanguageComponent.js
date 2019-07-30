import React, { Component } from 'react';
import renderFetch from '../../api/render';

class Language extends Component {
  constructor(props){
    super(props);
    this.state = {
      'repo-info' : this.props.repo[this.props.name],
    }
  }

  componentDidMount(){
    if(this.props.repo[this.props.name] !== undefined){
      this.setState({ 'repo-info' : this.props.repo[this.props.name] });
    }else{
      return renderFetch.renderRepoUrlRequests(this.props.url, 1, this.props.name)
          .then( data =>{
            this.setState({ 'repo-info': data });
            this.props.addToState(data, this.props.name, this.props.repo);
          });
    }
  }

  renderListFromKeys = (data) =>{
    let keys = Object.keys(data);
    return keys.map( key =>{
      return <li> {key} : {data[key]}</li>;
    })
  }

  render(){

   if(!this.state['repo-info']){
     //Put Loading bar here;
    //  return false;
    return(
      <p>Loading</p>
    );
   }else{
      return(
        <ul>{this.props.title} :
          {this.renderListFromKeys(this.state['repo-info'][0])}
        </ul>
      );
    }
  }
}

export default Language;