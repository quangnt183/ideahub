ideahub.controller("projCtrl", ["$scope", "$state", "userData", "appData", "working",
	function($scope, $state, userData, appData, working){
	$scope.goDocument = function(project){
		working.curProj = project;
		$state.transitionTo("documents");
	}
	$scope.userData = userData;
	$scope.appData = appData;
}]);