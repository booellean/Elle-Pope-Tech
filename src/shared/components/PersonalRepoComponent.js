import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineMarkSeries,
  Hint,
  VerticalBarSeries
} from 'react-vis';

import renderFetch from '../../api/render';

import Language from './SnippetLanguageComponent';
import Contributor from './SnippetContribComponent';
import Commit from './SnippetCommitComponent';

class PersonalRepo extends Component {
  constructor(props){
    super(props);

    this.state = {
      info : null,
      copy : null,
      ascending : {
        create : true,
        commit : true,
        alpha : true,
      },
      currentLang : 'reset',
      useCanvas: false,
      languages : {},
      languageData : [],
      commitData: {},
      xMinTime: Math.floor((new Date().setFullYear(new Date().getFullYear() - 3) /1000)),
      xMaxTime: Math.floor(new Date() / 1000)
    }
  }

  componentDidMount(){
    if(this.props.data !== null){
      this.setState({ info: this.props.data['repos'] });
      this.setState({ copy: this.props.data['repos'] });
      if(!this.props.data['languages-in-repos']){
        return this.setRepoValues(this.props.data['repos']);
      }
      return this.setState({ languages: this.props.data['languages-in-repos'] || {} });
    }else{

      return this.props.updateInitialState(this.props.fetchInitialData)
              .then( data =>{
                let repos = data[this.props.name].repos;
                this.setState({ info: repos });
                this.setState({ copy: repos });
                return this.setRepoValues(repos);
              });
    }
  }

  //Functions that manipulate data/behavior

  setRepoValues = (repos) =>{
    let stateCopy = repos;
    let languageCopy = {};
    let commitCopy = {};

    let languageRequest = repos.map( repo =>{
      return this.props.updatePartofStateArray(renderFetch.renderRepoUrlRequests, repo['languages_url'], 'total_languages', repo, 'repos')
        .then( data =>{
          repo['total_languages'] = data.data;
          stateCopy[stateCopy.indexOf(repo)] = repo;

          let keys = Object.keys(data.data[0]);

          keys.forEach(key =>{
            languageCopy[key] = (data.data[0][key] + languageCopy[key]) || data.data[0][key];
          })

          if(stateCopy.indexOf(repo) === (stateCopy.length - 1)){
            let arr = [];
            let k = Object.keys(languageCopy);
            k.forEach( key =>{
              arr.push({x: key, y: languageCopy[key]});
            })
            console.log(arr);
            this.setState({ languages : data.languages });
            this.setState({ languageData : arr })
          }
        });
    })

    let  commitRequest = repos.map( repo =>{
      return this.props.updatePartofStateArray(renderFetch.renderRepoUrlRequests, repo['commits_url'].split('{')[0], 'total_commits', repo, 'repos')
        .then( data =>{

          data.data.filter( commit => commit.author.login === 'booellean');

          repo['total_commits'] = data.data;

          data.data.forEach( commit =>{
            let month = new Date(commit.commit.author.date).toLocaleDateString('en-US', { month : '2-digit' })
            let year = new Date(commit.commit.author.date).toLocaleDateString('en-US', { year : 'numeric' })
            let date = `${year}/${month}`;
            commitCopy[date] = (commitCopy[date] + 1) || 1;
          })

          stateCopy[stateCopy.indexOf(repo)] = repo;

          this.setState({ commitData : commitCopy })
        })
    });

    let contribRequest = repos.map( repo =>{
      return this.props.updatePartofStateArray(renderFetch.renderRepoUrlRequests, repo['contributors_url'], 'total_contributors', repo,'repos')
        .then( data =>{
          repo['total_contributors'] = data.data;
          stateCopy[stateCopy.indexOf(repo)] = repo;
        })
    })

    return Promise.all(languageRequest, commitRequest, contribRequest)
                  .then( res =>{
                    return res
                  })
                  .then( res =>{
                    this.setState({ info: stateCopy });
                    this.setState({ copy: stateCopy });
                  })
  }

  addToState = (getDat, url, name, repo) =>{
    return this.props.updatePartofStateArray(getDat, url, name, repo, 'repos')
      .then( data =>{
        if(this.state.info.indexOf(repo) === (this.state.info.length - 1)){
          this.setState({ languages : data.languages });
        }
        return data.data;
      });
  }

  sortLanguage = (e, lang) =>{
    e.preventDefault();
    if(lang === 'reset'){
      return this.setState({ copy : this.state.info })
    }
    let filteredLangs =  this.state.info.filter( repo =>{
        return repo['total_languages'][0].hasOwnProperty(lang);
    });

    filteredLangs = filteredLangs.filter( arr => arr );

    this.setState({ copy : filteredLangs });
    this.setState({ currentLang : lang });
  }

  sortByDate = (e, type, state) =>{
    e.preventDefault();

    this.state.info.sort( (a, b) =>{
        if(this.state.ascending[state] === true){
          return new Date(a[type]) < new Date(b[type]) ? 1 : -1;
          }
          return new Date(a[type]) > new Date(b[type]) ? 1 : -1;
    });

    this.sortLanguage(e, this.state.currentLang);
    return this.state.ascending[state] = !this.state.ascending[state];
  }

  sortByName = (e, state) =>{
    e.preventDefault();

    //Sort by repo name
    this.state.info.sort( (a, b) =>{
      if(this.state.ascending[state] === true){
        return a.name < b.name ? 1 : -1;
        }
        return a.name > b.name ? 1 : -1;
    });

    this.sortLanguage(e, this.state.currentLang);
    return this.state.ascending[state] = !this.state.ascending[state];
  }

  //Functions that create nodes

  createRepoNode = (item) =>{
    return(
      <li className="repo-info" key={item.id}>
        <Link to={`/${this.props.name}/${item['name']}`}>
          <h3>{item['name']}</h3>
        </Link>
        <p>{item['description']}</p>
        <details>
          <p>Size: {item['size']}</p>
          <p>Created: {item['created_at']}</p>
          <p>Last Commit: {item['updated_at']}</p>
          <Language repo={item} addToState={this.addToState.bind(this)} name='total_languages' title='Languages' url={item['languages_url']}/>
          <Commit repo={item} addToState={this.addToState.bind(this)} name='total_commits' title='Commits' url={item['commits_url'].split('{')[0]}/>
          <Contributor repo={item} addToState={this.addToState.bind(this)} name='total_contributors' title='Contributors' url={item['contributors_url']}/>
        </details>
      </li>
    );
  }

  createLanguagesList = (langs) =>{
    let keys = Object.keys(langs);

    if(keys.length === 0){
      return <li>Loading...</li>;
    }
     return keys.map( key =>{
      return <li key={key} onClick={(e) => this.sortLanguage(e, key)}>{key} ({langs[key]})</li>
    })
  }

  //Take from react-vis documentation directly.
  //https://github.com/uber/react-vis/blob/master/showcase/axes/dynamic-hints.js
  _forgetValue = () => {
    this.setState({
      value: null
    });
  };

  _rememberValue = value => {
    this.setState({value});
  };

  render(){

   if(!this.state.copy){
     //Put Loading bar here;
     return false;
   }else{
    const axisStyle = {
      ticks: {
        fontSize: '14px',
        color: '#333'
      },
      title: {
        fontSize: '16px',
        color: '#333'
      }
    };

    const getCommitPoints = () =>{
      let arr = [];
      let keys = Object.keys(this.state.commitData);
      keys.sort();
      keys.forEach(key =>{
        // arr.push( { x : `${keys.indexOf(key)}`, y : this.state.commitData[key], label: key} );
        arr.push( { x : `${Math.floor(new Date(key) /1000)}`, y : this.state.commitData[key]} );
      })
      return arr;
    }

    const {value} = this.state;

    const {useCanvas} = this.state;
    const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;

    const listItems = this.state.copy.map( item => {
        return(
          this.createRepoNode(item)
        );
      });

      return(
        <React.Fragment>
          <header id='page-header'>
            <h2 onClick={(e) => this.sortLanguage(e, 'reset')} >Languages</h2>
            <p onClick={(e) => this.sortByDate(e, 'created_at', 'create')}>Created Date</p>
            <p onClick={(e) => this.sortByDate(e, 'updated_at', 'commit')}>Commit Date</p>
            <br/>
            <p onClick={(e) => this.sortByName(e, 'alpha')}>Sort by Repo Name</p>
            {this.createLanguagesList(this.state.languages)}
          </header>
          <article id="content">
            <div id="graph-container">
              <h3>Total Activity</h3>
              <FlexibleXYPlot
                height={300}
                yDomain={[0, 250]}
                xDomain={[this.state.xMinTime, this.state.xMaxTime]}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis tickLabelAngle={-45} xType="time"
                  tickFormat={d => {
                    let date = new Date(d*1000);
                    return date.toLocaleDateString('en-US', { month: "2-digit", year: "numeric" });
                  }}
                  />
                <YAxis/>
                <LineMarkSeries
                  onValueMouseOver={this._rememberValue}
                  onValueMouseOut={this._forgetValue}
                  data={getCommitPoints()}
                />
                {value ? (
                  <Hint value={value}>
                    <div className="rv-hint__content">
                      {`${value.y} Commits`}
                      <br />
                      {`occurred on ${new Date(value.x*1000).toLocaleDateString('en-US', { month: "long", year: "numeric" })}`}
                    </div>
                  </Hint>
                ) : null}
              </FlexibleXYPlot>
              
              <h3>Total Languaes by Line</h3>
              <FlexibleXYPlot 
                xType="ordinal"
                xDistance={100}
                height={300}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis tickFormat={ k =>{
                  if(k>0){
                    if(k>999999){
                      return `${Math.floor(k/100000)/10}M`
                    }else{
                      return `${Math.floor(k/1000)}k`
                    }
                  }
                  return k
                }}/>          
                <BarSeries className="language-data" data={this.state.languageData} />
              </FlexibleXYPlot>
            </div>
          </article>
        </React.Fragment>
      );
    }
  }
}

export default PersonalRepo;