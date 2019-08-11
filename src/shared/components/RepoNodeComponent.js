import React from 'react';
import { Link } from 'react-router-dom';

function RepoNode(props){
    let item = props.item
    let options = {weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", year: "numeric", };
    let modifiedSize;

    if(item['size'] >= 1000000){
      modifiedSize = `${item['size']/1000000} GB`;
    }else if(item['size'] >= 1000){
      modifiedSize = `${item['size']/1000} MB`;
    }else if(item['size'] < 1000 && item['size'] > 0){
      modifiedSize = `${item['size']} KB`;
    }else{
      modifiedSize = `>1 KB`;
    }

  return(
    <li className="repo-info" key={item.id}>
      {props.name === 'repos' ? (
        <Link to={`/${props.name}/${item['name']}`}>
          <h4>{item['name']}</h4>
        </Link>
      ) : (
        <h4>{item['name']}</h4>
      )}
      {/* <Link to={`/${props.name}/${item['name']}`}>
        <h4>{item['name']}</h4>
      </Link> */}
      <p>{item['description']}</p>
      <dl>
        <dt>Size:</dt> <dd>{modifiedSize}</dd><br/>
        <dt>Created On:</dt> <dd>{new Date(item['created_at']).toLocaleDateString('en-US', options)}</dd><br/>
        <dt>Last Commit Date:</dt> <dd>{new Date(item['updated_at']).toLocaleDateString('en-US', options)}</dd><br/>
        {/* <Language repo={item} addToState={this.addToState.bind(this)} name='total_languages' title='Languages' url={item['languages_url']}/>
        <Commit repo={item} addToState={this.addToState.bind(this)} name='total_commits' title='Commits' url={item['commits_url'].split('{')[0]}/>
        <Contributor repo={item} addToState={this.addToState.bind(this)} name='total_contributors' title='Contributors' url={item['contributors_url']}/> */}
      </dl>
    </li>
  );
}
export default RepoNode;