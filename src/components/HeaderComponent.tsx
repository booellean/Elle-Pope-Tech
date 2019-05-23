import * as React from 'react';
import Nav from './NavComponent';

export default class Header extends React.Component{
  public render(): React.ReactNode {
    return(
      <header id="page-header">
        This is the Header!
        <Nav />
      </header>
    );
  }
}
