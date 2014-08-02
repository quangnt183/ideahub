Kinetic.Comment = function(config) {
	this.____init(config);
};

Kinetic.Comment.prototype = {
	____init: function(config) {
		this.className = "Comment";
		Kinetic.Group.call(this, config);
		this.render();
		this.eventHandler();
	},
	render: function(){
		var scope = this.getScope(), data = scope.data;
		var dw = 200, dh = 50;
		this.setDraggable(true);
		this.add(this._rect = new Kinetic.Rect({
			width: dw,
			height: dh,
			stroke: "#333",
			cornerRadius: 10,
			fill: "rgba(200,200,200,0.6)"
		}));
		this.add(this._text = new Kinetic.Text({
			x: 5,
			y: 5,
			width: dw - 10,
			height: dh - 10,
			text: data.text,
			fontSize: 20,
			fill: "#333",
		}));
		if (!this.html) {
			this.html = angular.element("<div class='comment'/>");
			if (data.comments)
				for (var i = 0; i < data.comments.length; i ++)
					this.html.append(angular.element("<div>" +data.comments[i]+ "</div>"));
			this.html.append(angular.element("<input type='text' placeHolder='add comment'/>"));
			this.html.on("click", function(evt){
				event.preventDefault();
				return false;
			})
		}
		
		var self = this;
		setTimeout(function(){
			if (self.getStage()) {
				var sw = self.getStage().getWidth(),
				sh = self.getStage().getHeight(),
				element = document.querySelector("session");
				self.setAttrs({
					x: sw * data.ratioX,
					y: sh * data.ratioY,
				});
				self.getLayer().draw();
				self.html.css("top", element.offsetTop + sh * data.ratioY + "px")
				self.html.css("left", element.offsetLeft + sw * data.ratioX + "px")
			}
		}, 100);
		this.on("click tap", function(event){
			event.cancelBubble = true;
			scope.editable = true;
		});
	},
	eventHandler: function(){
		var scope = this.getScope(), data = scope.data, self = this;
		this.setDragBoundFunc(function(pos){
			var sw = self.getStage().getWidth(),
				sh = self.getStage().getHeight(),
				element = document.querySelector("session");
			data.ratioX = pos.x / sw;
			data.ratioY = pos.y / sh;
			self.html.css("top", element.offsetTop + pos.y +  "px")
			self.html.css("left", element.offsetLeft + pos.x + "px")
			return pos;
		});
		scope.$watch("curTool", function(){
			self.setDraggable(scope.curTool == 1)
		});
		scope.$watch("editable", function(){
			if (scope.editable) {
				if (self.html.parent().length == 0)
					angular.element(document.querySelector("session")).append(self.html);
				self.html.css("display", "block");
			} else self.html.css("display", "none");
		})
	}
};
Kinetic.Util.extend(Kinetic.Comment, Kinetic.Group);
// add getters setters
Kinetic.Factory.addGetterSetter(Kinetic.Comment, 'scope', {});


Kinetic.Arrow = function(config) {
	this.____init(config);
};

Kinetic.Arrow.prototype = {
	____init: function(config) {
		this.className = "Arrow";
		Kinetic.Group.call(this, config);
		this.render();
		this.eventHandler();
	},
	render: function(){
		var md = this.getModel();
		this.setAttrs(md.getGroup());
		this.add(this._bg = new Kinetic.Polygon(md.getBgPoly()))
		.add(this._shape = new Kinetic.Line(md.getShape()));
		if (md.get("isArrow"))
			this.add(this._arrow = new Kinetic.Line(md.getArrow()));
		this.add(this._resize = new Kinetic.Image(md.getResize()))
		.add(this._remove = new Kinetic.Image(md.getRemove()));
	},
	eventHandler: function(){
		var md = this.getModel(), self = this;
		this._resize.setDragBoundFunc(function(pos){
			var grPos = self.getAbsolutePosition(),
			m = self.getLayerTransform();
			md.resizeMove({
				x: (pos.x - grPos.x) / m[0],
				y: (pos.y - grPos.y) / m[0],
			});
			return pos;
		});
		md.on("change", $.hitch(this,this.change));
	},
	change: function(event){
		var md = this.getModel();
		this.setAttrs(md.getGroup());
		this._bg.setAttrs(md.getBgPoly());
		this._shape.setAttrs(md.getShape());
		if (this._arrow) this._arrow.setAttrs(md.getArrow())
		this._resize.setAttrs(md.getResize());
		this._remove.setAttrs(md.getRemove());
	}
};
Kinetic.Util.extend(Kinetic.Arrow, Kinetic.Group);

// add getters setters
Kinetic.Factory.addGetterSetter(Kinetic.Arrow, 'model', {});

Kinetic.DrawPath = function(config) {
	this.____init(config);
};

Kinetic.DrawPath.prototype = {
	____init: function(config) {
		// call super constructor
		Kinetic.Shape.call(this, config);
		this.className = "DrawPath";
		this.setAttrs({
			stroke: "#333",
			lineCap: "round",
			lineJoin: "round",
		});
		this.eventHandler();
	},
	render: function(){
		var points = this.getScope().points = [], ratios = this.getScope().data.ratios;
		if (this.getStage()){
			var sw = this.getStage().getWidth(),
			sh = this.getStage().getHeight();
			for (var i = points.length; i < ratios.length; i ++){
				points[i] = [];
				points[i][0] = sw * ratios[i][0];
				points[i][1] = sh * ratios[i][1];
			}
		}
	},
	eventHandler: function(){
		var scope = this.getScope(), data = scope.data, self = this;
		scope.$watch("data.ratios.length", function(){
			try {
				self.getLayer().draw();
			} catch (e) {
				console.log(e)
			}
		});
	},
	drawFunc: function(canvas) {
		this.render();
		var ctx = canvas.canvas.context, points = this.getScope().points;
		ctx.beginPath();
		ctx.moveTo(points[0][0], points[0][1]);
		for (var i = 1; i < points.length; i ++){
			ctx.lineTo(points[i][0], points[i][1]);
		}
		canvas.fillStrokeShape(this);
	},
	// drawHitFunc: function(canvas){
	// 	var curSW = this.getStrokeWidth();
	// 	this.setStrokeWidth(20);
	// 	this.drawFunc(canvas, true);
	// 	this.setStrokeWidth(curSW);
	// },
};
Kinetic.Util.extend(Kinetic.DrawPath, Kinetic.Shape);
Kinetic.Factory.addGetterSetter(Kinetic.DrawPath, 'scope', {});





