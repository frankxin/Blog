import * as React from 'react';
import * as _ from 'lodash'
import { BrowserRouter, Route, Link, match, Switch } from "react-router-dom";
import http from '../modules/http';
import 'regenerator-runtime/runtime';

interface ListProps { }
interface ListState {
  articles: Array<{ id: string, tag: string, title: string, date: string }>
}
export class List extends React.Component<ListProps, ListState> {
  constructor(props: ListProps) {
    super(props)
    this.state = {
      articles: []
    }
  }
  async componentDidMount() {
    let res = await http.get(`/v1/articles`);
    this.setState({
      articles: res.data.articles
    })
  }
  render() {
    return (
      <ul className="articles">
        {this.state.articles.map(
          (article) =>
            <li key={article.id}>
              <h1 className="article__title">
                <Link to={`/article/${article.id}`}>{article.title}</Link>
              </h1>
              <p>{article.date}</p>
            </li>
        )
        }
      </ul>
    )
  }
}