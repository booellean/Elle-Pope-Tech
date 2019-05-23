import * as React from 'react';
import { request } from 'http';

interface MainState {
  page: string;
}
interface MainProps {
  params : string;
}

export default class Main extends React.Component<MainProps, MainState>{
  constructor(props: MainProps){
    super(props);

    // this.state = {
    // };
  }

  public render(): React.ReactNode {
    return(
      <main id="page-main">
        {this.props.match.params}

      </main>
    );
  }
}
