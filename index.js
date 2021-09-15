const express = require('express');
const app = express();
const porta = 3000;
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');

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

//Rota principal
app.get('/', (req, res) => {
  res.render('index');
})

app.listen(porta, (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log(`servidor rodando na porta ${porta}`)
  }
})
