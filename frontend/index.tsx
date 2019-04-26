import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash'
import { BrowserRouter, Route, Link, match, Switch } from "react-router-dom";
import 'regenerator-runtime/runtime';
import './index.css'
import { Article } from './Article'
import { List } from './List'
class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <Link className="link-to-home" to="/">
            <h2>FrankZx</h2>
          </Link>
        </nav>
        <Switch>
          <Route exact path="/" component={List} />
          <Route path="/article/:id" component={Article} />
        </Switch>
      </div>
    )
  }
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  ,
  document.getElementById('app')
);