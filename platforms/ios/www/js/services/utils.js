(function(){// plugin bezier
	var fact = function(k) {
		var f = 1;
		while (k > 0){
			f *= k;
			k --;
		}
		return f;
	}
	var Bernstain = [[],[],[1,2,1],[1,3,3,1],[1,4,6,4,1]];
	var B = function(i,n,t){
		var b;
		if (Bernstain[n] && Bernstain[n][i]) b = Bernstain[n][i];
		else {
			b = fact(n) / (fact(i) * fact(n-i));
		}
		var ret = b * Math.pow(t, i) * Math.pow(1-t, n-i);
		return ret;
	}
	var distance = function(a, b){
		return Math.sqrt(Math.pow(a[0]-b[0], 2) + Math.pow(a[1]-b[1], 2));
	}
	var P = function (t, points){
		var r = [0,0];
		var n = points.length-1;
		for(var i=0; i <= n; i++){
			r[0] += points[i][0] * B(i, n, t);
			r[1] += points[i][1] * B(i, n, t);
		}
		return r;
	}
	var computeSupportPoints = function (points, params){
		/**Compute the incremental step*/
		var tLength = 0;
		for(var i=0; i< points.length-1; i++){
			tLength += distance(points[i], points[i+1]);
		}
		var step = (params.bezStep?params.bezStep:4) / tLength;
		//compute the support points
		var temp = [], l = params.last? 1: 0.75;
		for(var t=0;t<=l; t=t+step){
			var p = P(t, points);
			temp.push(p);
		}
		return temp;
	}
	window["_u"] = {
		hitch: function(scope, fn){
			var args = arguments;
			if (arguments.length >= 2)
				return function(){
					var arr = Array.prototype.slice.call(arguments);
					for (var i = args.length - 1; i	> 1; i --) arr.splice(0, 0, args[i]);
					return fn.apply(scope, arr);
				}
		},
		bezier: function(initialPoints, params){
			if (initialPoints.length > 1) {
				var supportPoints = computeSupportPoints(initialPoints, params);
				return supportPoints;
			} else return initialPoints;
		},
		uuid: function() {
			var uuid = (function () {
				var i,
				c = "89ab",
				u = [];
				for (i = 0; i < 36; i += 1) {
					u[i] = (Math.random() * 16 | 0).toString(16);
				}
				u[8] = u[13] = u[18] = u[23] = "-";
				u[14] = "4";
				u[19] = c.charAt(Math.random() * 4 | 0);
				return u.join("");
			})();
			return uuid;
		},
		getEventXY: function(event) {
	      var eX, eY;
	      if (event.pageX) {
	        eX = event.pageX; eY = event.pageY;
	      } else {
	        eX = event.originalEvent.touches[0].pageX;
	        eY = event.originalEvent.touches[0].pageY;
	      }
	      return {x: eX, y: eY}
	    }
	}
})();