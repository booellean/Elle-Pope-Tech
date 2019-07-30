import React, { Component } from 'react';
import renderFetch from '../../api/render';

class Contributor extends Component {
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
      return renderFetch.renderRepoUrlRequests(this.props.url, 1, this.props.name)
          .then( data =>{
            this.setState({ 'repo-info': data });
            this.props.addToState(data, this.props.name, this.props.repo);
          });
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
      return(
        /// TODO: add graph information for Contributions in Repo, important for open source projects
        <ul> {this.props.title} :
          {this.state['repo-info'].map( user =>{
            return(
              <li>
                <ul>
                  <li>{user.login}</li>
                  <li>{user.url}</li>
                  <li>contributions: {user.contributions}</li>
                </ul>
              </li>
            );
          })}
        </ul>
      );
    }
  }
}

export default Contributor;