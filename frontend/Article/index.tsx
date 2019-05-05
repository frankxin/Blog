import * as React from 'react';
import * as _ from 'lodash'
import { BrowserRouter, Route, Link, match, Switch } from "react-router-dom";
import http from '../modules/http';
import 'regenerator-runtime/runtime';
import * as marked from 'marked'
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'
import './index.css';

interface ArticleProps {
    match: match<{ id: string }>
}
interface ArticleState {
    id: string,
    content: string,
    metaData: {
        title: string,
        date: string,
        tag: string
    },
    intialRender: boolean
}
export class Article extends React.Component<ArticleProps, ArticleState> {
    constructor(props: ArticleProps) {
        super(props)
        this.state = {
            id: '',
            content: '',
            metaData: {
                title: '',
                date: '',
                tag: ''
            },
            intialRender: true
        }
    }
    async componentDidMount() {
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
        renderer.heading = (text, level, raw, slugger) => {
            return '<h'
                + level
                + ' id="'
                + slugger.slug(raw)
                + '">'
                + `<a class="anchor" name="${text}" href="`+ `#${text}` + '"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>'
                + text
                + '</h'
                + level
                + '>\n';
        }
        
        this.setState({
            content: marked(res.data.content, { renderer }),
            metaData: res.data.metaData
        })
        
        loadDisqus(this.props.match.params.id, res.data.metaData.title)
    }

    componentDidUpdate(prevProps: ArticleProps, prevState: ArticleState) {
        if(this.state.intialRender){
            jump(location.hash)
            this.setState({intialRender: false})
        }
        if (this.props.match.params.id !== prevProps.match.params.id) {
            http.get(`/v1/articles/${this.props.match.params.id}`)
                .then(res => {
                    this.setState({
                        content: marked(res.data.content)
                    })
                })
        }
    }

    createMarkup() {
        return {
            __html: this.state.content
        }
    }

    render() {
        return (
            <div>
                <div>{this.state.metaData.date}</div>
                <main className="content" dangerouslySetInnerHTML={this.createMarkup()}></main>
                <div id="disqus_thread"></div>
            </div>
        )
    }

}

function loadDisqus(id: string, title: string): void {
    window.disqus_config = function () {
        this.page.title = title;
        this.page.url = location.href;  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = id; // Replace PAGE_DENTIFIER with your page's unique identifier variable
    };

    var d = document, s = d.createElement('script');
    s.src = 'https://frankxin93.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
}

function jump(h){
    var url = location.href;               //Save down the URL without hash.
    location.href = h;                 //Go to the target element.
    history.replaceState(null,null,url);   //Don't like hashes. Changing it back.
}