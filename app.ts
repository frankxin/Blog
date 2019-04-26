import * as express from 'express';
import * as marked from 'marked';
import * as path from 'path';
import * as fs from 'fs';
import * as moment from 'moment'
console.log('RUN APP')

// Create a new express application instance
const app: express.Application = express();
app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/v1/articles/:articleId', function (req, res) {
  res.send({
    article: fs.readFileSync(`./articles/${req.params.articleId}.md`).toString()
  })
  // res.render('index', {title: 'ZxinZ', main: marked(fs.readFileSync(`./articles/${req.params.articleId}.md`).toString())})
});

app.get('/v1/articles', async function (req,res){
  let articlesFileName = fs.readdirSync('./articles', {encoding: 'utf-8'})
  let articles = articlesFileName.map(name => {
    const md = fs.readFileSync(`./articles/${name}`).toString()
    const {info} = extractArticleMetadata(md)
    return Object.assign({
      // type.md => type
      id: name.split('.')[0],
      ...info
    }, {
      date: moment(info.date).format('DD MMM YYYY')
    })
  })
  articles.sort(
    (a, b)=> 
      moment(b.date).valueOf() - moment(a.date).valueOf()
  )
  res.send({
    articles
  })
})

app.get('*', (req,res) =>{
  if(/article/.test(req.path)){
    res.render('index', {disqus: true})
  }else{
    res.render('index', {disqus: false})
  }
});

app.listen(80, function () {
  console.log('App listening on port 80!');
});

function extractArticleMetadata(md: string){
  let {info, removedInfoMarkdown} = extractInfoFromMarkdown(md)
  return {
    info,
    content: removedInfoMarkdown
  }
}

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
