module.exports = function (config, UploadWidget) {
  
  var Promise = config.Promise;
  
  /**
   *
   * @param {object} opts
   * @param {object[]} opts.files
   */
  UploadWidget.prototype.files_Add = function (opts) {
    var self     = this;
    self.is_busy = true;
    
    if (opts.files.length > 10) {
      self.data.error.text = "Please only select a maximum of 10 files at once";
      return true;
    }
    
    return Promise.resolve()
      .then(function () {
        return opts.files;
      })
      .each(function (raw_file) {
        
        return Promise.resolve()
          .then(function () {
            return self.initializeFile({
              file: raw_file
            });
          })
          .then(function (f) {
            raw_file = f;
            return true;
          })
          .then(function () {
            self.files[raw_file.upload_id] = raw_file;
            return true;
          })
          .then(function () {
            return self.uploadQueue_Add({
              file: raw_file
            });
          })
          .then(function () {
            return true;
          });
        
      })
      .catch(function (e) {
        return resolveError(e);
      })
      .finally(function () {
        self.is_busy = false;
      });
    
  };
  
  /**
   *
   * @param {object} opts
   * @param {object[]} opts.files
   */
  UploadWidget.prototype.files_Remove = function (opts) {
    var self     = this;
    self.is_busy = true;

    if (opts.files.length === 0) {
      console.warn('files_Remove: No files passed for removal');
      return true;
    }

    return Promise.resolve()
      .then(function () {
        return opts.files;
      })
      .map(function (raw_file) {

        return Promise.resolve()
          .then(function () {
            delete self.files[raw_file.upload_id];
            return true;
          })
          .then(function () {
            return self.uploadQueue_Remove({
              file: raw_file
            });
          })
          .then(function () {
            return true;
          });

      })
      .catch(function (e) {
        return resolveError(e);
      })
      .finally(function () {
        self.is_busy = false;
      });

  };
  
};