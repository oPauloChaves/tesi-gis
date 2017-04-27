module.exports = (app) => {
  /* GET home page. */
  app.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
  });

}