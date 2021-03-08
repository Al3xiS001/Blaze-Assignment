const express = require('express');
const router = express.Router();
const faker  = require('faker');
const Task = require('../models/task');

router.get('/', async (req, res) => {
  res.render('index');
});


router.get('/add-customer', (req, res, next) => {
  res.render('add-customer');
});

router.post('/add-customer', async (req, res, next) => {
  const task = new Task(req.body);
  await task.save();
  res.redirect('/add-customer');
});


router.get('/edit/:id', async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  console.log(task)
  res.render('edit', { task });
});

router.post('/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  await Task.update({_id: id}, req.body);
  res.redirect('/customers/1');
});

router.get('/delete/:id', async (req, res, next) => {
  let { id } = req.params;
  await Task.remove({_id: id});
  res.redirect('/customers/1');
});

router.get('/customers/:page', (req, res, next) => {
  let perPage = 10;
  let page = req.params.page || 1;

  Task
    .find({}) // finding all documents
    .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
    .limit(perPage) // output just 9 items
    .exec((err, tasks) => {
      Task.count((err, count) => { // count to calculate the number of pages
        if (err) return next(err);
        res.render('customers', {
          n: perPage,
          tasks,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    });
});

router.get('/pre-populate/:number', (req, res, next) => {
  let { number } = req.params;
  for(let i = 0; i < number; i++) {
    const task = new Task();
    task["First Name"] = faker.name.firstName();
    task["Last Name"] = faker.name.lastName();
    task["Email"] = faker.internet.email();
    task["Phone Number"] = faker.phone.phoneNumber();
    task.save(err => {
      if (err) { return next(err); }
    });
  }
  res.redirect('/');
});
module.exports = router;