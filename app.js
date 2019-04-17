"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const fs = require("fs");
console.log('RUN APP');
// Create a new express application instance
const app = express();
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('views', './views');
app.set('view engine', 'ejs');
app.get('/v1/articles/:articleId', function (req, res) {
    res.send({
        article: fs.readFileSync(`./articles/${req.params.articleId}.md`).toString()
    });
    // res.render('index', {title: 'ZxinZ', main: marked(fs.readFileSync(`./articles/${req.params.articleId}.md`).toString())})
});
app.get('/v1/articles', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let articles = fs.readdirSync('./articles', { encoding: 'utf-8' });
        articles = articles.map(name => {
            return name.split('.')[0];
        });
        res.send({
            articles
        });
    });
});
app.get('*', (req, res) => {
    if (/article/.test(req.path)) {
        res.render('index', { disqus: true });
    }
    else {
        res.render('index', { disqus: false });
    }
});
app.listen(3000, function () {
    console.log('App listening on port 3000!');
});
//# sourceMappingURL=app.js.map