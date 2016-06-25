module.exports = function (app, config) {
  require('./dir')(app, config);
  require('./service')(app, config);
};