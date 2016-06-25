module.exports = function (app, config) {
  
  var Promise = config.Promise;
  var cuid    = config.cuid;
  
  app
    .controller('MainController',
      ['$scope',
        function ($scope) {

          $scope.upload_widget_id   = cuid();
          $scope.max_files          = 1;
          $scope.min_files          = 1;
          $scope.accept             = 'image/*';
          $scope.support_multiple   = true;
          $scope.maximum_size_bytes = 307200;
          $scope.minimum_size_bytes = 100;

          $scope.control = {
            done  : function (d) {
              $scope.receive_images(d);
              return true;
            },
            cancel: function () {
              return true;
            }
          };

          $scope.receive_images = function (images) {
            // change here, print for now
            console.log(images);
            return true;
          };

        }]);
  
};