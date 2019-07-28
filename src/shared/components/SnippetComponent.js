import React, { Component } from 'react';
import renderFetch from '../../api/render';

class Snippet extends Component {
  constructor(props){
    super(props);
    // : async (url, page, name, arr=[])
    this.state = {
      'repo-info' : this.props.repo[this.props.name]
    }
  }

  componentDidMount(){
    if(this.props.repo[this.props.name] !== undefined){
      // return this.setState({ info: this.props.data });
      this.setState({ 'repo-info' : this.props.repo[this.props.name] });
      // return console.log(this.state.info);
    }else{
      return renderFetch.renderRepoUrlRequests(this.props.url, 1, this.props.name)
          .then( data =>{
            this.setState({ 'repo-info': data });
            //this.props.addToState(data, this.props.name, this.props.repo);
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
    switch(this.props.title){
      case 'Languages':
        return <p>{this.props.title} :
                  <ul>
                    {this.renderListFromKeys(this.state['repo-info'][0])}
                  </ul>
                </p>;
        break;
      case 'Commits':
        return <p>{this.props.title} : {this.state['repo-info'].length}</p>;
        break;
      case 'Contributors':
        return <p>{this.props.title} :
                <ul>
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
              </p>;
        break;
      default:
        return <p>No data found!</p>
    }
    }
  }
}

export default Snippet;