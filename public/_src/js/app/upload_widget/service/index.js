module.exports = function (app, config) {
  
  var Promise = config.Promise;
  
  app
    .factory('service_upload_widget', ['Upload', 'GLOBAL',
      function (Upload, GLOBAL) {
        
        /*
         * FORMAT
         * upload_widget_cache = {
         'sample_upload_id': 'UploadWidgetInstance'
         };
         * */
        var upload_widget_cache = {};
        
        /**
         *
         * @param {object} opts
         * @param {string} opts.directive_config
         */
        var UploadWidget = function (opts) {
          var self     = this;
          self.is_busy = false;
          
          // config
          self.config                     = {};
          self.config.id                  = opts.directive_config.upload_widget_id;
          self.config.max_files           = opts.directive_config.max_files; // max files that can be checked
          self.config.max_files_selection = 10; // max files that can be selected at once by user in their system 
          self.config.accept              = opts.directive_config.accept;
          self.config.support_multiple    = opts.directive_config.support_multiple;
          self.config.maximum_size_bytes  = opts.directive_config.maximum_size_bytes;
          self.config.minimum_size_bytes  = opts.directive_config.minimum_size_bytes;
          self.config.upload_group        = opts.directive_config.upload_group;
          
          // data
          self.data       = {};
          self.data.error = {
            text: "" // a universal error that is displayed on top of the widget e.g. when invalid files are selected
          };
          
          // files
          // key = file.upload_id, value=file
          self.files = {};
          
          // upload queue
          // key = file.upload_id, value=ngFileUpload-Promise
          self.upload_queue = {};
        };
        
        require('./initialize_file')(config, UploadWidget);
        require('./files_crud')(config, UploadWidget);
        require('./upload_queue_crud')(config, UploadWidget, GLOBAL, Upload);
        
        return {
          
          /**
           *
           * @param {object} opts
           * @param {object} opts.directive_config
           */
          getUploadWidgetInstance: function (opts) {
            
            var id = opts.directive_config.upload_widget_id;
            
            if (upload_widget_cache.hasOwnProperty(id)) {
              return upload_widget_cache[id];
            }
            
            // set new
            upload_widget_cache[id] = new UploadWidget(opts);
            return upload_widget_cache[id];
          }
          
        };
      }
    ]);
  
};