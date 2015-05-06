var favicon = require('serve-favicon');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// /parse the body so you can access parameters in requests in req.body. e.g. req.body.name.
var bodyParser = require('body-parser');
var mongo = require('mongodb');

// Configurations of the routes are stored in separate files index.js and
// users.js
//var routes = require('./routes/index');
////var users = require('./routes/users');
////var users = require('./routes/inputForm');

var app = express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .use('/', express.static(__dirname + '/client'))
  //app.use(multer()); // for parsing multipart/form-data
  .use('/node_modules/angular', express.static(__dirname + '/node_modules/angular'))
  
  .post('/insert', function(req, res) {
      // Connect to DB.
      var MongoClient = mongo.MongoClient;
      var url = 'mongodb://localhost:27017/yellowBook';

      MongoClient.connect(url, function(err, db) {
        if (err) {
          console.dir(err);
          process.exit(1);
        }
        var contactsCollection = db.collection('Contacts');
        console.log('Connected to DB');

        insertDocuments(contactsCollection, function(err, result) {

          if (err) {
            console.log('ERROR(2.9)');
            console.dir(err);
            }
            console.log('In transition to getDocuments(3)');
            console.log('Result(3.1):' + result);
        });//insert

        var docData = getDocuments(contactsCollection, function(err, result){
          if (err) {
            console.log('ERROR(5.1)');
            console.dir(err);
          }
          result.forEach( function(myDoc) {
            console.log("FirstName: " + myDoc.firstName + " " + "LastName: " + myDoc.lastName);
          });
        });// getDocuments
      }); //MongoClient.connect

      //Insert into DB
      var insertDocuments = function(contactsCollection, callback) {
          console.log('Start Insert(1)');
          contactsCollection.insert(req.body, function(err, result) {
            console.log('In Insert function_4(2)');
            if (err) {
              console.log('ERROR in insert');
              console.dir(err);
              // if (err.message === "All ready processing") {
              //   return callback();
              // }
              //return callback(err);
            }
            callback(null, result);
          });
        };

      //Find
      var getDocuments = function(contactsCollection, callback) {
          console.log('In getDocuments function.(4)');
          contactsCollection.find().toArray(function(err, docs) {
            console.log('Found the following records(5)');

            //var fullNameStr = req.body.firstName + ' ' + req.body.lastName;
            res.json({contactsNames: docs});
            callback(null, docs);
          });
        };
      console.log('Type of docData:' + typeof docData);
      //console.log('Result:' + docData);
      //res.json({fullName: fullNameStr});
    }) //insert
    .post('/show', function(req, res) {
      var MongoClient = mongo.MongoClient;
      var url = 'mongodb://localhost:27017/yellowBook';

      MongoClient.connect(url, function(err, db) {
        if (err) {
          console.dir(err);
          process.exit(1);
        }
        var contactsCollection = db.collection('Contacts');
        console.log('Connected to DB');

        contactsCollection.find().toArray(function(err, docs) {
          //console.log('Type of docs: ' + typeof docs);
          res.json({contactsNames: docs});
        })
      })
    })//post show.

    .post('/find', function(req, res) {
      var firstName = req.body.firstName;
      var lastName = req.body.lastName;
      var MongoClient = mongo.MongoClient;
      var url = 'mongodb://localhost:27017/yellowBook';

      MongoClient.connect(url, function(err, db) {
        if (err) {
          console.dir(err);
          process.exit(1);
        }
        var contactsCollection = db.collection('Contacts');
        console.log('Connected to DB');

        contactsCollection.find({firstName: firstName}).toArray(function(err, docs) {
          console.log('Docs:');
          console.dir(docs);
          res.json({contactsNames: docs});
        })
      })
    })//post find

    .post('/remove', function(req, res) {
      var firstName = req.body.firstName;
      var lastName = req.body.lastName;
      var MongoClient = mongo.MongoClient;
      var url = 'mongodb://localhost:27017/yellowBook';

      MongoClient.connect(url, function(err, db) {
        if (err) {
          console.dir(err);
          process.exit(1);
        }
        var contactsCollection = db.collection('Contacts');
        console.log('Connected to DB');

        contactsCollection.remove({firstName: firstName, lastName: lastName}, function(err, docs) {
          res.json({contactsNames: docs});
        })
      })
    })//post find

  // uncomment after placing your favicon in /public
  //app.use(favicon(__dirname + '/public/favicon.ico'));
  // app.use(logger('dev'));
  // app.use(cookieParser());
  //Specify a location of serving files(images, css, js)
  //app.use(express.static(path.join(__dirname, 'public')));

  ////app.use('/', routes);
  ////app.use('/users', users);
  ////app.use('/inputForm', inputForm);

  // catch 404 and forward to error handler
  // app.use(function(req, res, next) {
  //   var err = new Error('Not Found');
  //   err.status = 404;
  //   next(err);
  // });

  // error handlers

  // development error handler
  // will print stacktrace
  // if (app.get('env') === 'development') {
  //   app.use(function(err, req, res, next) {
  //     //res.status(err.status || 500);
  //     // res.render('error', {
  //     //   message: err.message,
  //     //   error: err
  //     // });
  //   });
  // }

  // production error handler
  // no stacktraces leaked to user
  // app.use(function(err, req, res, next) {
  //   res.status(err.status || 500);
  //   // res.render('error', {
  //   //   message: err.message,
  //   //   error: {}
  //   // });
  // });
  .listen(3000);
