module.exports = function (app, config) {
  
  var Promise = config.Promise;
  var ajv     = config.ajv({
    removeAdditional: false
  });
  
  /**
   * -directive saves every upload instance given an upload_id and restores the upload instance once instantiated
   *  with the same upload id
   *
   * -directive calls control.done with an array of objects: @each object is a response.image object where response is the
   *  response got from the server after uploading the image (server should put this on the response returned)
   *
   * -200 response code = ok, otherwise the it is assumed to be an error. The response.msg is shown to the user
   *  The server should append this .msg to the error response, else a default .msg is shown
   *
   * -directive calls control.cancel if the user cancels the uploader
   */
  
  app
    .directive('uploadWidget', ['service_upload_widget',
      function (service_upload_widget) {
        return {
          restrict   : 'AE',
          templateUrl: 'upload_widget.tpl',
          scope      : {
            uploadWidgetId  : '=',
            maxFiles        : '=',
            minFiles        : '=',
            accept          : '=',
            supportMultiple : '=',
            maximumSizeBytes: '=',
            minimumSizeBytes: '=',
            control         : '='  // control.done function will get the links of the selected images, control.cancel called on cancel
          },
          link       : function ($scope) {
            
            var directive_config = {
              upload_widget_id  : $scope.uploadWidgetId,
              max_files         : $scope.maxFiles,
              min_files         : $scope.minFiles,
              accept            : $scope.accept,
              support_multiple  : $scope.supportMultiple,
              maximum_size_bytes: $scope.maximumSizeBytes,
              minimum_size_bytes: $scope.minimumSizeBytes,
              control           : $scope.control
            };
            
            var schema = require('./_dir_schema')();
            
            var valid = ajv.validate(schema, directive_config);
            
            if (!valid) {
              var e = new Error(ajv.errorsText());
              e.ajv = ajv.errors;
              throw e;
            }
            
            $scope.UploadWidget = service_upload_widget.getUploadWidgetInstance({
              directive_config: directive_config
            });
            
            // helpers
            $scope.addFiles = function (files, invalid_files) {
              
              $scope.UploadWidget.data.error.text = "";
              
              if (invalid_files && invalid_files.length > 0) {
                $scope.UploadWidget.data.error.text = 'One or more files could not be added because they are ' +
                  'invalid. Please ensure that the file(s) type is an image, and is less than 300KB';
              }
              
              return $scope.UploadWidget.files_Add({
                  files: files
                })
                .catch(function (e) {
                  return resolveError(e);
                });
            };
            
            $scope.removeFile = function (file) {
              return $scope.UploadWidget.files_Remove({
                  files: [file]
                })
                .catch(function (e) {
                  return resolveError(e);
                });
            };
            
            $scope.checkSelection = function () {
              var num_checked                     = 0;
              $scope.UploadWidget.data.error.text = "";
              
              for (var key in $scope.UploadWidget.files) {
                
                if ($scope.UploadWidget.files.hasOwnProperty(key)) {
                  if ($scope.UploadWidget.files[key].is_checked) {
                    num_checked++;
                  }
                }
                
              }
              
              if (num_checked < directive_config.min_files) {
                $scope.UploadWidget.data.error.text = 'You need to select at least ' + directive_config.min_files + ' file(s)';
                return true;
              }
              
              if (num_checked > directive_config.max_files) {
                $scope.UploadWidget.data.error.text = 'You need to select at most ' + directive_config.max_files + ' file(s)';
                return true;
              }
            };
            
            $scope.done = function () {
              var num_checked                     = 0;
              var db_imgs                         = [];
              $scope.UploadWidget.data.error.text = "";
              
              return Promise.resolve(Object.keys($scope.UploadWidget.files))
                .each(function (file_id) {
                  var file = $scope.UploadWidget.files[file_id];
                  if (!file.is_checked || !file.is_uploaded || !file.db_img) {
                    return true;
                  }
                  
                  db_imgs.push(file.db_img);
                  num_checked++;
                  return true;
                })
                .then(function () {
                  if (num_checked < directive_config.min_files) {
                    $scope.UploadWidget.data.error.text = 'You need to select at least ' + directive_config.min_files + ' file(s) that have been successfully uploaded';
                    return true;
                  }
                  
                  if (num_checked > directive_config.max_files) {
                    $scope.UploadWidget.data.error.text = 'You need to select at most ' + directive_config.max_files + ' file(s)';
                    return true;
                  }
                  
                  // return imgs
                  directive_config.control.done(db_imgs);
                  return true;
                });
            };
            
            $scope.minimize = function () {
              $scope.UploadWidget.data.error.text = "";
              // call cancel for now
              directive_config.control.cancel();
            };
            
            $scope.cancel = function () {
              $scope.UploadWidget.data.error.text = "";
              // need to call the existing directive_config, old one might have run out of existence
              directive_config.control.cancel();
            };
          }
        };
      }]);
  
};