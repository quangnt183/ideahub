ideahub.controller("docCtrl", ["$scope", "$state", "userData", "working", "$http",
	function($scope, $state, userData, working, $http ){
	$scope.curProj = working.curProj;

  $scope.notification = '';

  
  $scope.theChannel = 'document';
  $scope.subscribe = function() {
    $scope.PubNub.ngSubscribe({ channel: 'document' });
  }
}]);