module.exports = function (config, UploadWidget) {

  var Promise = config.Promise;
  var cuid    = config.cuid;

  /**
   *
   * @param {object} opts
   * @param {object} opts.file
   */
  UploadWidget.prototype.initializeFile = function (opts) {

    var file = opts.file;

    return Promise.resolve()
      .then(function () {
        if (!file) {
          throw new Error('initializeFile: No file');
        }

        return true;
      })
      .then(function () {
        file.upload_id   = cuid();
        file.progress    = 0;
        file.is_checked  = false;
        file.is_uploaded = !!file.is_uploaded; // in case it is from cache
        file.is_errored  = !!file.is_errored;
        file.db_img      = null; // the sql image saved in db
        file.error       = file.error || {
            client_text: '', // error on client side
            server_text: ''  // error from server
          };

        return file;
      });
  };

};