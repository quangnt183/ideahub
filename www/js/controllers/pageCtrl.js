ideahub.controller("pageCtrl", ["$scope", "$state", "userData", "working",
	function($scope, $state, userData, working){
	$scope.curDoc = working.curDoc;
	$scope.curProj = working.curProj;
}]).
directive("session", ["$timeout", "working", function($timeout, working){
  return {
    restrict: "E",
    link: function(scope, element){
      var stage = new Kinetic.Stage({
        container: element[0],
        width: window.innerWidth - 64,
        height: window.innerHeight - 44
      });
      stage.add(scope.shapeLayer = new Kinetic.Layer());
      angular.element(window).on("resize", function(){
        stage.setWidth(window.innerWidth - 64);
        stage.setHeight(window.innerHeight - 44);
        stage.draw();
      });

      var img = new Image(), pageImage;
      img.src = working.curDoc.pages[0].image;
      img.onload = function(){
      	scope.shapeLayer.add(pageImage = new Kinetic.Image({
      		x: 0, y: 0,
      		image: img
      	}));
      	scope.shapeLayer.draw();
      }

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
            mpChain = [[event.pageX, event.pageY]];
            mpChain["id"] = _u.uuid();
            mpChain["end"] = 'false';
            break;
          case 'm': //mousemove
            if (mpChain)
              mpChain.push([event.pageX, event.pageY]);
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