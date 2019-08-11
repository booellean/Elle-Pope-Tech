import React, { Component } from 'react';
import temp from '../temp.gif';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      info : this.props.data,
      bio : 'Eventually, a bio will go here'
    }
  }

  componentDidMount(){
    if(this.props.data !== null){
      this.setState({ info: this.props.data[0] });
    }else{
      return this.props.fetchInitialData()
          .then( data =>{
            let newDat = JSON.parse(data);
            this.setState({ info: newDat[this.props.name][0] });
            this.props.updateInitialState(newDat);
          });
    }
  }

  render(){

   if(!this.state.info){
     return(
      <React.Fragment>
        <header id='page-header'>
        </header>
        <img src={temp} alt="loading cat is loading the page now!"></img>
      </React.Fragment>
     );
   }else{
    let options = { month: "long", day: "numeric", year: "numeric", };

      return(
        <React.Fragment>
          <header id='page-header'>
          <h2><a href={this.state.info.html_url} target="_blank">{this.state.info.login}</a></h2>
            <img id= "profile-avatar" src={this.state.info.avatar_url} alt="I professional picture of Elle Pope a.k.a. booellean"/>
            <dl>
              <dt>Active Since : </dt><dd>{new Date(this.state.info.created_at).toLocaleDateString('en-US', options)}</dd>
              <dt>Repos to Date: </dt><dd>{this.state.info.public_repos + this.state.info.total_private_repos}</dd>
            </dl>
            <p>{this.state.info.bio}</p>
          </header>
          <article id="content">
            {this.state.bio}
          </article>
        </React.Fragment>
      );
    }
  }
}

export default Home;