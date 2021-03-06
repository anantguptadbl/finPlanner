/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , EmployeeProvider = require('./employeeprovider').EmployeeProvider;

// External Stuff
var app = express();
var favicon = require("serve-favicon");
var morgan = require("morgan");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

//app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  // Since we have moved from jade to pug, we need to rename this as well
  app.set('view engine', 'pug');
  app.set('view options', {layout: false});
  app.use(favicon(path.join(__dirname, "public", "ico", "favicon.ico")));
  // Change between NPM 3 and NPM 4
  app.use(morgan("combined"));
  //app.use(express.logger('dev'));
  app.use(bodyParser());
  //app.use(express.methodOverride());
  app.use(methodOverride('X-HTTP-Method-Override'))
  //app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(errorHandler());
//});


// catch 404 and forward to error handler
//app.use((req, res, next) => {
//  const err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.error = err;
  res.locals.error.status = err.status || 500;
  if (process.env.NODE_ENV === 'production') {
    delete err.stack;
  } else if (err.code === 'permission_denied') {
    res.status(403).send('Forbidden');
  } else if (err.code === 'permissions_not_found') {
    res.status(403).send('Could not find permissions for user. Bad configuration');
  } else if (err.code === 'user_object_not_found') {
    res.status(403).send('user object "user" was not found. Check your configuration.');
  }

  res.locals.title = 'Error';
  console.log(err);

  // Render the error page
  res.status(err.status || 500);
  // res.render('error');
});

//app.configure('development', function(){
  
//});

var employeeProvider= new EmployeeProvider('localhost', 27017);

//Routes

//index
/*
app.get('/', function(req, res){
  employeeProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'Employees',
            employees:emps
        });
  });
});
*/

//index
app.get('/', function(req, res){
  employeeProvider.findAll(function(error, emps){
      res.render('dashboard', {
            title: 'Main Dashboard'
        });
  });
});

// Main Dashboard
app.get('/dashboard', function(req, res){
  employeeProvider.findAll(function(error, emps){
      res.render('dashboard', {
            title: 'Main Dashboard'
        });
  });
});

// Profile Page
app.get('/profile', function(req, res){
  employeeProvider.findAll(function(error, emps){
      res.render('profile', {
            title: 'About myself'
        });
  });
});

// Contact Page
app.get('/contact', function(req, res){
  employeeProvider.findAll(function(error, emps){
      res.render('contact', {
            title: 'Contact Me'
        });
  });
});

// Get PPF Data
app.post('/getPFData', function(req, res){
  var keys = Object.keys(req);
  console.log("The PPF DATA INPUT ARGUMENTS IS " + keys);
  console.log("The PPF DATA INPUT ARGUMENTS IS " + Object.keys(req['params']));
  console.log("The PPF DATA INPUT ARGUMENTS IS " + Object.keys(req['query']));
});

//new employee
app.get('/employee/new', function(req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee
app.post('/employee/new', function(req, res){
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//update an employee
app.get('/employee/:id/edit', function(req, res) {
	employeeProvider.findById(req.param('_id'), function(error, employee) {
		res.render('employee_edit',
		{ 
			title: employee.title,
			employee: employee
		});
	});
});

//save updated employee
app.post('/employee/:id/edit', function(req, res) {
	employeeProvider.update(req.param('_id'),{
		title: req.param('title'),
		name: req.param('name')
	}, function(error, docs) {
		res.redirect('/')
	});
});

//delete an employee
app.post('/employee/:id/delete', function(req, res) {
	employeeProvider.delete(req.param('_id'), function(error, docs) {
		res.redirect('/')
	});
});

app.listen(process.env.PORT || 3000);
