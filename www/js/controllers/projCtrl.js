
ideahub.controller("projCtrl", ["$scope", "$state", "$http", function($scope, $state, $http){
	$scope.goDocument = function(){
		$state.transitionTo("documents");
	}

  $scope.notification = '';

  $scope.updateMessage = function(m) {
    $scope.notification = m;
  }

  $scope.saveDocument = function() {
    msg = {
      x: 'x',
      y: 'y'
    }
    $http.put('http://localhost:7000/save', msg).
      success(function(data, status) {
        console.log(data, status);
        $scope.notification = "save okey" + JSON.stringify(data) + data;
      }).
      error(function(err, status) {
        $scope.notification = "save fail"
      });
  };

  $scope.getDocument = function() {
    $http.get('http://localhost:7000/data').
      success(function(data, status) {
        console.log(data);
      }).
      error(function(err, status) {
        console.log(err);
      })
  };

ideahub.controller("projCtrl", ["$scope", "$state", "userData", "appData", "working",
	function($scope, $state, userData, appData, working){
	$scope.goDocument = function(project){
		working.curProj = project;
		$state.transitionTo("documents");
	}
	$scope.userData = userData;
	$scope.appData = appData;

}]);