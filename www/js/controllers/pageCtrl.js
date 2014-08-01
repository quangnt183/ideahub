ideahub.controller("pageCtrl", ["$scope", "$state", "userData", "working", "$ionicPopup", "$timeout", 
	function($scope, $state, userData, working, $ionicPopup, $timeout){
	$scope.curDoc = working.curDoc;
	$scope.curProj = working.curProj;
  $scope.curTool = 0; // 1, 2, 3 for comment, pen, eraser
  $scope.toolBg = {};
  $scope.selectTool = function(tool){
    if (tool == $scope.curTool) $scope.curTool = 0;
    else $scope.curTool = tool;
    $scope.toolBg = {}; $scope.toolBg[tool] = {"background-color": "rgba(31,31,31,0.3"}
  }

  $scope.$on("tap", function(evt, mpChain){
    if ($scope.curTool == 1) {
      $scope.$broadcast("addComment", mpChain)
    }
  });
  $scope.$on("move", function(evt, mpChain){
    // if (mpChain.length == 2) addDraw(mpChain);
  });


	$scope.savePop = function(){
	  $scope.data = {}

	  // An elaborate, custom popup
	  var myPopup = $ionicPopup.show({
	    template: '<input type="password" ng-model="data.wifi">',
	    title: 'Enter Wi-Fi Password',
	    subTitle: 'Please use normal things',
	    scope: $scope,
	    buttons: [
	      { text: 'Cancel' },
	      {
	        text: '<b>Save</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	          if (!$scope.data.wifi) {
	            //don't allow the user to close unless he enters wifi password
	            e.preventDefault();
	          } else {
	            return $scope.data.wifi;
	          }
	        }
	      },
	    ]
	  });
	  myPopup.then(function(res) {
	    console.log('Tapped!', res);
	  });
	  // $timeout(function() {
	  //    myPopup.close(); //close the popup after 3 seconds for some reason
	  // }, 3000);
	}
}]).
directive("session", ["$timeout", "working", function($timeout, working){
  return {
    restrict: "E",
    link: function(scope, element){
      var stage = new Kinetic.Stage({
        container: element[0],
      });
      stage.add(scope.shapeLayer =document.tmp1=  new Kinetic.Layer());
      var img = new Image(), pageImage;
      img.src = working.curDoc.pages[0].image;
      var resize = img.onload = function(){
        stage.setHeight(window.innerHeight - 44);
        stage.setWidth(img.width * stage.getHeight() / img.height)
      	scope.shapeLayer.add(pageImage = new Kinetic.Image({
      		x: 0, y: 0,
      		height: stage.getHeight(),
      		width: stage.getWidth(),
      		image: img
      	}));
        element.css("margin-left", (window.innerWidth - 64 - stage.getWidth())/ 2 + "px")
      	// pageImage.setX((stage.getWidth() - pageImage.getWidth()) / 2);
      	scope.shapeLayer.draw();
      }
      angular.element(window).on("resize", resize);

      scope.$on("addComment", function(evt, mpChain){
        console.log('aaa', mpChain)
        var data = {
          x: mpChain[0][0],
          y: mpChain[0][1],
          text: "abc"
        }
        var ss = scope.$new();
        ss.data = data;
        scope.shapeLayer.add(new Kinetic.Comment({scope: ss}));
        scope.shapeLayer.draw();
      });
      $timeout(function(){
        element.on("mouseup mousedown mousemove " + 
        "touchstart touchmove touchend", function(event){
          scope.$apply(function(){eat(event)});
        });
      }, 100);
      var mpChain;
      var eat = function(event){
        if (event.type[0] == 'm') digestMouse(event);
        else digestTouch(event);
      },
      digestMouse = function(event){
        switch (event.type[5]) {
          case 'd': //mousedown
            mpChain = [[event.layerX, event.layerY]];
            mpChain["id"] = _u.uuid();
            mpChain["end"] = 'false';
            break;
          case 'm': //mousemove
            if (mpChain)
              mpChain.push([event.layerX, event.layerY]);
            break;
          case 'u': //mouseup
            if (mpChain)
              mpChain['end'] = 'true';
            break;
        }
        if (mpChain) processMouse();
      },
      processMouse = function() {
        if (mpChain.end == "true") {
          if (mpChain.length == 1)
            scope.$emit("tap", mpChain);
          mpChain = null;
        } else scope.$emit("move", mpChain);
      }
      
    }
  }
}])