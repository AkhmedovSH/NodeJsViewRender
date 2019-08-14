const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const config = require('./config');
const routes = require('./routes/index');
const mongoose = require('mongoose');

// Database connection
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('debug', config.IS_PRODUCTION);
mongoose.connection
.on('error', error => reject(error))
.on('close', () => console.log('Database connection closed.'))
.once('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
});

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });


// Express uses and set
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(__dirname + '/node_modules/jquery/dist/')
);


// ROUTES
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/api/auth', routes.auth);
app.use('/api/auth', routes.auth);

app.use((req,res,next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});



// Listen PORT
app.listen(config.PORT, () =>
  console.log(`Example app listening on port ${config.PORT}!`)
);

module.exports = app;
