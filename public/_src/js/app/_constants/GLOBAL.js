module.exports = function (app) {

  app
    .constant("GLOBAL", {
      upload_path: prompt('Upload path? e.g. /api/upload/images') || null
    });
};