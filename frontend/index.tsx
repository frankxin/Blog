import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash'
import { BrowserRouter, Route, Link , match, Switch} from "react-router-dom";
import http from './modules/http';
import 'regenerator-runtime/runtime';
import * as marked from 'marked'
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'
import './index.css'

interface ListProps {}
interface ListState {
  articles: Array<string>
}
class List extends React.Component<ListProps, ListState> {
  constructor(props: ListProps){
    super(props)
    this.state = {
      articles: []
    }
  }
  async componentDidMount(){
    let res = await http.get(`/v1/articles`);
    this.setState({
      articles: res.data.articles
    })
  }
  render(){
    return (
      <ul className="articles">
        {this.state.articles.map(
          (name) => <li key={name}><h1 className="article__title"><Link to={`/article/${name}`}>{name}</Link></h1></li>)}
      </ul>
    )
  }
}
interface ArticleProps {
  match: match<{id: string}>
}
interface ArticleState {
  id: string,
  content: string,
  date: string
}
class Article extends React.Component<ArticleProps, ArticleState> {
  constructor(props: ArticleProps){
    super(props)
    this.state = {
      id: '',
      content: '',
      date: ''
    }
  }
  async componentDidMount(){
    loadDisqus(this.props.match.params.id)
    let res = await http.get(`/v1/articles/${this.props.match.params.id}`);
    const renderer = new marked.Renderer()
    const highlight = (code, lang) => {
      let html = Prism.highlight(code, Prism.languages.javascript, 'javascript');
      return html
    }
    const langPrefix = 'language-'
    renderer.code = (code, infostring, escaped) => {
      var lang = (infostring || '').match(/\S*/)[0];
      if (highlight) {
        var out = highlight(code, lang);
        if (out != null && out !== code) {
          escaped = true;
          code = out;
        }
      }

      if (!lang) {
        return '<pre><code>'
          + (escaped ? code : _.escape(code))
          + '</code></pre>';
      }

      return '<pre class="'
        + langPrefix
        + _.escape(lang) +
        '"><code class="'
        + langPrefix
        + _.escape(lang)
        + '">'
        + (escaped ? code : _.escape(code))
        + '</code></pre>\n';
    };
    let {info, removedInfoMarkdown} = extractInfoFromMarkdown(res.data.article)

    this.setState({
      content: marked(removedInfoMarkdown, {renderer}),
      date: info.date
    })
  }

  componentDidUpdate(prevProps: ArticleProps, prevState: ArticleState){
    if(this.props.match.params.id !== prevProps.match.params.id){
      http.get(`/v1/articles/${this.props.match.params.id}`)
        .then(res=>{
          this.setState({
            content: marked(res.data.article)
          })
        })
    }
  }

  createMarkup(){
    return {
      __html: this.state.content
    }
  }

  render(){
    return (
      <div>
        <div>{this.state.date}</div>
        <main dangerouslySetInnerHTML={this.createMarkup()}></main>
        <div id="disqus_thread"></div>
      </div>
    )
  }

}

class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <h2>FrankZx</h2>
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
    <App/>
  </BrowserRouter>
  ,
  document.getElementById('app')
);

function extractInfoFromMarkdown(md: string): {
  info: {
    title: string,
    date: string,
    tag: string
  },
  removedInfoMarkdown: string
}{
  let info = {} as any
  let removedInfoMarkdown = ''
  for(let v of ['title', 'date', 'tag']){
    let reg = new RegExp(`-{3,}[\\s\\S]+${v}:\\s*([\\s\\S]+?)\\n[\\s\\S]+-{3,}`)
    let mdMatch = md.match(reg);
    if(mdMatch){
      info[v] = mdMatch[1] || ''
    }
  }
  removedInfoMarkdown = md.replace(/-{3,}[\s\S]+?-{3,}/, '')
  return {info, removedInfoMarkdown}
}

function loadDisqus(id: string): void{
  window.disqus_config = function () {
    this.page.url = '127.0.0.1:3000';  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = id; // Replace PAGE_DENTIFIER with your page's unique identifier variable
  };

  var d = document, s = d.createElement('script');
  s.src = 'https://frankxin93.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
}
