const express = require('express');
const app = express();
const porta = 3000;
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./users/User');


// view engine configuration
app.set('view engine', 'ejs');

//static
app.use(express.static('public'));

//body-parse configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//database
connection
  .authenticate()
  .then(() => {
    console.log('conexão feita com o banco de dados!');
  })
  .catch(err => console.log(err));

//Rotas separadas
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

//Rota principal
app.get('/', (req, res) => {
  Article.findAll({
    order: [
      ['id', 'DESC']
    ], 
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render('index', {
        articles: articles,
        categories: categories
      });
    });
  });
});

app.get('/:slug', (req, res) => {
  let slug = req.params.slug;
  Article.findOne({
    where: {slug: slug}
  }).then(article => {
    if(article != undefined) {
      Category.findAll().then(categories => {
        res.render('article', {article: article, categories: categories});
      });
    } else{
      res.redirect('/');
    }
  }).catch(err => {
    res.redirect('/');
  })
});

app.get('/category/:slug', (req, res) => {
  let slug = req.params.slug;
  Category.findOne({
    where: {slug: slug},
    include: {model: Article}
  }).then(category => {
    if(category != undefined) {

      Category.findAll().then(categories => {
        res.render('index', {
          articles: category.articles,
          categories: categories
        });
      })

    } else {
      res.redirect('/');
    }
  }).catch(err => {
    res.redirect('/');
  })
})

app.listen(porta, (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log(`servidor rodando na porta ${porta}`)
  }
})
