ideahub.controller("pageCtrl", ["$scope", "$state", "userData", "working", "$ionicPopup", "$timeout", "$http",
	function($scope, $state, userData, working, $ionicPopup, $timeout, $http){
	$scope.curDoc = working.curDoc;
	$scope.curProj = working.curProj;
  $scope.notification = '';

  /*
  * fire whenever user press Save to online
  * need full data of current document to be assigned to data
  * if email is present -> share
  */
  $scope.saveData = function(data, email, callback) {
    if(!data)
      // sample
      data = {
        x: 'x',
        y: 'y'
      }

    $http.put(config.server + '/save', {page: data, email: email}).
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
                  saveData($scope.working, null, function() {
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
      var stage = document.tmp1= new Kinetic.Stage({
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
      		height: stage.getHeight(),
      		width: img.width * stage.getHeight() / img.height,
      		image: img
      	}));
      	pageImage.setX((stage.getWidth() - pageImage.getWidth()) / 2);
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