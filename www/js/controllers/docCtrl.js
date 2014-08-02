ideahub.controller("docCtrl", ["$scope", "$state", "userData", "working", "$http",
	function($scope, $state, userData, working, $http ){
	$scope.curProj = working.curProj;

	$scope.goDocument = function(doc){
		working.curDoc = doc;
		$state.transitionTo("pages");
	}
	$scope.goProject = function(doc){
		$state.transitionTo("projects");
	}
}]);