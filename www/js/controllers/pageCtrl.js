ideahub.controller("pageCtrl", ["$scope", "$state", "userData", "appData", "working", "$ionicPopup", "$timeout", "$http",
	function($scope, $state, userData, appData, working, $ionicPopup, $timeout, $http){
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
    if ($scope.curTool == 2) {
      $scope.$broadcast("addDraw", mpChain) 
    }
  });

  $scope.notification = '';

  /*
  * fire whenever user press Save to online
  * need full data of current document to be assigned to data
  * if email is present -> share
  */
  $scope.saveData = function(email, callback) {
    $http.put(config.server + '/save', {page: appData, email: email}).
      success(function(data, status) {
        console.log("save working data success", data);
        callback(data);
      }).
      error(function(data, status) {
        console.log("fail", data);
      });
  }

  $scope.sharePop = function() {
    $scope.data = {}

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.email">',
      title: 'Enter Emaill Address To Share',
      subTitle: 'We need a working email address',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            
            if (!$scope.data.email) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              $scope.saveData(data, $scope.data.email, function() {
                console.log("Saved data success");
              })
            }
          }
        },
      ]
    });
    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });
    
  }
	$scope.savePop = function(){
	  $scope.data = {}

	  // An elaborate, custom popup
	  var myPopup = $ionicPopup.show({
	    template: '<input type="text" ng-model="data.email">',
	    title: 'Enter Your Emaill Address',
	    subTitle: 'We need an identity',
	    scope: $scope,
	    buttons: [
	      { text: 'Cancel' },
	      {
	        text: '<b>Save</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	          if (!$scope.data.email) {
	            //don't allow the user to close unless he enters wifi password
	            e.preventDefault();
	          } else {
              $http.put(config.server + '/email', {data: $scope.data.email}).
                success(function(data, status) {
                  console.log("register email success", data);
                  $scope.saveData(null, function() {
                     $scope.notification = "Saved email and working data success"
                  });
                }).
                error(function(data, status) {
                  console.log("fail", data);
                });
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

      var resize = function(){
        var h = window.innerHeight - 44,
        w = img.width * h / img.height;
        
        stage.setHeight(h);
        stage.setWidth(w)
        pageImage.setAttrs({
          width: w, height: h
        })
        element.css("margin-left", (window.innerWidth - 64 - w)/ 2 + "px")
      }

      img.onload = function(){
      	scope.shapeLayer.add(pageImage = new Kinetic.Image({
      		x: 0, y: 0,
      		image: img
      	}));
        resize();
      	scope.shapeLayer.draw();
      }
      
      angular.element(window).on("resize", resize);

      scope.$on("addComment", function(evt, mpChain){
        var data = {
          ratioX: mpChain[0][0],
          ratioY: mpChain[0][1],
          text: "abc"
        }
        var ss = scope.$new();
        ss.data = data;
        scope.shapeLayer.add(new Kinetic.Comment({scope: ss}));
      });
      var curDrawId;
      scope.$on("addDraw", function(evt, mpChain){
        if (!curDrawId || curDrawId != mpChain.id) {
          curDrawId = mpChain.id;
          var data = {
            ratios: mpChain,
          }
          var ss = scope.$new();
          ss.data = data;
          console.log(ss)
          scope.shapeLayer.add(new Kinetic.DrawPath({scope: ss}));  
        }
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
            mpChain = [[event.layerX / stage.getWidth(), event.layerY / stage.getHeight()]];
            mpChain["id"] = _u.uuid();
            mpChain["end"] = 'false';
            break;
          case 'm': //mousemove
            if (mpChain)
              mpChain.push([event.layerX / stage.getWidth(), event.layerY / stage.getHeight()]);
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