module.exports = function (config) {

  var objectFit = config.objectFit;

  (function objectFitInit() {
    //object fit
    try {
      objectFit.polyfill({
        selector          : 'img', // this can be any CSS selector
        fittype           : 'cover', // either contain, cover, fill or none
        disableCrossDomain: 'false' // either 'true' or 'false' to not parse external CSS files.
      });
    }
    catch (e) {
      console.error('objectFitInit', e);
    }
  })();

};