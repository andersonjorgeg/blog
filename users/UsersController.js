const express = require('express');
const router = express.Router();
const User = require('./user');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/users', adminAuth, (req, res) => {
  User.findAll().then(users => {
    res.render('admin/users/index', {
      users: users
    });
  })
});

router.get('/admin/users/create', adminAuth, (req, res) => {
  res.render('admin/users/create');
});

router.post('/users/create', adminAuth, (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({
    where: {email: email}
  }).then(user => {
    if(user == undefined) {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(password, salt);

      User.create({
        email: email,
        password: hash
      }).then(() => {
        res.redirect('/admin/users');
      }).catch(err => {
        res.redirect('/admin/users');
      });
    } else {
      res.redirect('/admin/users/create');
      
    }
  });
});

router.post('/users/delete', adminAuth, (req, res) => {
  let id = req.body.id;
  if(id != undefined){

    if(!isNaN(id)){
      User.destroy({
        where: {id: id}
      }).then(() => {
        res.redirect('/admin/users')
      })
    } else {
      res.redirect('/admin/users')
    }

  } else {
    res.redirect('/admin/users')
  }
});

router.get('/admin/users/edit/:id', adminAuth, (req, res) => {
  let id = req.params.id;

  if(isNaN(id)){
    res.redirect('/admin/users');
  }

  User.findByPk(id).then(user => {
    if(user != undefined){
      res.render('admin/users/edit', {
        user: user
      })
    } else {
      res.redirect('admin/users');
    }
  }).catch(err => {
    res.redirect('admin/users');
  });
});

router.post('/users/update', adminAuth, (req, res) => {
  let id = req.body.id;
  let email = req.body.email;
  let password = req.body.password;

  User.update({email: email, password: password}, {
    where: {id: id}
  }).then(() => {
    res.redirect('/admin/users');
  })
});

router.get('/login', (req, res) => {
  res.render('admin/users/login')
});

router.post('/authenticate', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({where: {email: email}}).then(user => {
    if(user != undefined) {
      let correct = bcrypt.compareSync(password, user.password);
      if(correct){
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.render('admin/painel');
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = router;
