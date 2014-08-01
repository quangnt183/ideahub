ideahub.controller("docCtrl", ["$scope", "$state", "userData", "working",
	function($scope, $state, userData, working){
	$scope.curProj = working.curProj;
}]);