import * as express from 'express';
import * as marked from 'marked';
import * as path from 'path';
import * as fs from 'fs';
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
  let articles = fs.readdirSync('./articles', {encoding: 'utf-8'})
  articles = articles.map(name => {
    return name.split('.')[0]
  })
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

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
