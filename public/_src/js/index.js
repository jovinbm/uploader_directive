var Promise   = require('bluebird');
var $         = require('jquery');
var angular   = require('angular');
var cuid      = require('cuid');
var url       = require('url');
var extend    = require('extend');
var ajv       = require('ajv');
var objectFit = require('objectFit');

var config = {
  window   : window,
  Promise  : Promise,
  $        : $,
  angular  : angular,
  url      : url,
  cuid     : cuid,
  extend   : extend,
  ajv      : ajv,
  objectFit: objectFit
};

require('./init')(config);
require('./app')(config);