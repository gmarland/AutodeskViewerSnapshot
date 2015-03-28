define([
],

function() {
	var Slide = {};

	Slide.List = Backbone.View.extend({
    	el: "<div>",

    	_imgSrc: null,

		initialize: function(options) {
			this.el.className = "slide-list-item";

			this._imgSrc = options.imgSrc;

			this._parent = options.parent;

			this.render();
      	},

		render: function() {
			var that = this;

			$.get("/app/templates/slide/list.html", function(contents) {
				that.$el.html(_.template(contents, {
					imgSrc: that._imgSrc
				}));
			}, "text");
		}
	});

	return Slide;
});