module.exports = function (config) {

  var Promise = config.Promise;
  var angular = config.angular;

  var app = angular.module('app', [
    'ngFileUpload',
    'ngAnimate',
    'angular-loading-bar'
  ]);

  function trackDigests(app) {
    app.run(["$rootScope", function ($rootScope) {
      Promise.setScheduler(function (cb) {
        $rootScope.$evalAsync(cb);
      });
    }]);
  }

  trackDigests(app);

  require('./_constants')(app, config);
  require('./controller')(app, config);
  require('./upload_widget')(app, config);

};