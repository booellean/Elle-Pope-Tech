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
      this.headerContent(this.props.data[0]);
    }else{
      return this.props.fetchInitialData()
        .then( data =>{
          let newDat = JSON.parse(data);
          this.setState({ info: newDat[this.props.name][0] });
          this.props.updateInitialState(newDat);
          this.headerContent(newDat);
        });
    }
    
  }

  headerContent = (data) =>{
    let options = { month: "long", day: "numeric", year: "numeric" };

    let fragment = (
      <React.Fragment>
        <h2><a href={data.html_url} target="_blank">{data.login}</a></h2>
        <img id= "profile-avatar" src={data.avatar_url} alt="I professional picture of Elle Pope a.k.a. booellean"/>
        <dl>
          <dt>Active Since : </dt><dd>{new Date(data.created_at).toLocaleDateString('en-US', options)}</dd><br/>
          <dt>Repos to Date : </dt><dd>{data.public_repos + data.total_private_repos}</dd><br/>
        </dl>
        <p>{data.bio}</p>
      </React.Fragment>
    );

    this.props.updatePageHeaderContent(fragment);
  }

  render(){

   if(!this.state.info){
     return(
      <React.Fragment>
        <img src={temp} alt="loading cat is loading the page now!"></img>
      </React.Fragment>
     );
   }else{
      return this.state.bio
    }
  }
}

export default Home;