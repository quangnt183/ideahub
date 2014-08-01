Kinetic.Comment = function(config) {
	this.____init(config);
};

Kinetic.Comment.prototype = {
	____init: function(config) {
		this.className = "BaseShape";
		Kinetic.Group.call(this, config);
		this.render();
		this.eventHandler();
	},
	render: function(){
		var data = this.getScope().data;
		var dw = 200, dh = 100;
		this.add(this._rect = new Kinetic.Rect({
			x: data.x,
			y: data.y,
			width: dw,
			height: dh,
			stroke: "#333",
			cornerRadius: 10,
			fill: "rgba(200,200,200,0.6)"
		}));
		this.add(this._text = new Kinetic.Text({
			x: data.x + 5,
			y: data.y + 5,
			width: dw - 10,
			height: dh - 10,
			text: data.text,
			fontSize: 23,
			fill: "#333",
		}))
	},
	live: function(){
		this.baseEventHandler();
		this.eventHandler();
	},
	eventHandler: function(){
		var data = this.getScope().data;
		this.setDragBoundFunc(function(pos){
			data.x = pos.x;
			data.y = pos.y;
			return pos;
		});
	},
};
Kinetic.Util.extend(Kinetic.Comment, Kinetic.Group);
// add getters setters
Kinetic.Factory.addGetterSetter(Kinetic.Comment, 'scope', {});