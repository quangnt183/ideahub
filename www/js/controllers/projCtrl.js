ideahub.controller("projCtrl", ["$scope", "$state", function($scope, $state){
	$scope.goDocument = function(){
		$state.transitionTo("documents");
	}
}]);