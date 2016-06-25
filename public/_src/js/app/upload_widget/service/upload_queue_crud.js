module.exports = function (config, UploadWidget, GLOBAL, Upload) {
  
  var Promise = config.Promise;
  
  /**
   *
   * @param {object} opts
   * @param {object} opts.file
   */
  UploadWidget.prototype.uploadQueue_Add = function (opts) {
    var self = this;
    
    var file;
    
    return Promise.resolve()
      .then(function () {
        if (!opts.file || !opts.file.upload_id) {
          throw new Error('uploadQueue_Add: No file or file.upload_id');
        }

        if (!self.files[opts.file.upload_id]) {
          throw new Error('uploadQueue_Add: file.upload_id points to undefined in self.files');
        }
        
        return true;
      })
      .then(function () {
        // ref to file in self.files
        file = self.files[opts.file.upload_id];
        return true;
      })
      .then(function () {
        var upl = Upload.upload({
          url : GLOBAL.upload_path,
          data: {
            upload_group: self.config.upload_group,
            file        : file
          }
        });

        self.upload_queue[file.upload_id] = upl;

        upl
          .then(function (resp) {
              // success
              file.is_uploaded       = true;
              file.is_errored        = false;
              file.error.server_text = '';
              file.error.client_text = '';
              file.db_img            = resp.data.image;
            },
            function (error_resp) {
              // error

              var e                  = error_resp.data || {};
              file.is_uploaded       = false;
              file.progress          = 0;
              file.is_errored        = true;
              file.error.server_text = e.msg || 'Something did not go too well. Try checking your connection';
              file.error.client_text = '';
              file.db_img            = null;
              return true;
            },
            function (evt) {
              // progress
              file.progress = parseInt(100.0 * evt.loaded / evt.total);
              return true;
            })
          .catch(function (e) {
            file.is_uploaded       = false;
            file.progress          = 0;
            file.is_errored        = true;
            file.error.server_text = '';
            file.error.client_text = e.msg || 'Something did not go too well. Try checking your connection';
            file.db_img            = null;
            console.log(e);
            return true;
          });
        return true;
      });
  };

  /**
   *
   * @param {object} opts
   * @param {object} opts.file
   */
  UploadWidget.prototype.uploadQueue_Remove = function (opts) {
    var self = this;

    var file = opts.file;

    return Promise.resolve()
      .then(function () {
        if (!file || !file.upload_id) {
          throw new Error('uploadQueue_Remove: No file or file.upload_id');
        }

        return true;
      })
      .then(function () {
        if (!self.upload_queue.hasOwnProperty(file.upload_id)) {
          console.warn('uploadQueue_Remove: Trying to remove an an upload instance that does not exist');
          return true;
        }

        // abort and delete
        self.upload_queue[file.upload_id].abort();
        delete self.upload_queue[file.upload_id];
        return true;
      });
  };
  
};