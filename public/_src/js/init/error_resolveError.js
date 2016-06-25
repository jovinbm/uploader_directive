module.exports = function (config) {

  var window  = config.window;
  var Promise = config.Promise;

  /**
   *
   * @param {object} error
   * @returns {*}
   */
  window.resolveError = Promise.method(function (error) {
    
    var e = error;
    
    if (!e || !(e instanceof Error)) {
      e = new Error('resolveError: No error context');
    }
    
    if (e.isCustomError) {
      
      if (e.isHandled) {
        console.warn('Resolve error: Received an error that was already handled');
        return true;
      }
      
      e.isHandled = true;
      
      if (e.print) {
        console.error(e);
      }
      
      if (e.reload) {
        window.location.reload(true);
        return true;
      }
      
      if (e.redirect) {
        if (e.redirectUrl) {
          window.location.href = e.redirectUrl;
          return true;
        }
        if (e.redirectPath) {
          window.location.href = e.redirectPath;
          return true;
        }
      }
      
      if (e.notify && e.msg) {
        //axpData.showToast({
        //  type: e.type || 'warning',
        //  text: e.msg
        //});
      }
      
    }
    else {
      console.error(e);
    }

    return true;

  });
  
};