define([
	"modules/viewer",
	"modules/slide"
],

function(Viewer, Slide) {
	var Deck = {};

	Deck.Index = Backbone.View.extend({
    	el: "<div>",

    	_slides: [],

		initialize: function(options) {
			this.el.id = "deck";
			this.el.className = "full-content";

			this.on("addImage", this.addImage);

			this.render();
      	},

		render: function() {
			var that = this;

			$.get("/app/templates/deck/index.html", function(contents) {
				that.$el.html(_.template(contents, {
					deck: that.model
				}));

				that.afterRender();
			}, "text");
		},

		afterRender: function() {
			if (this._viewer) {
				this._viewer.destroy();
				this._viewer = null;
			}

			this._viewer = new Viewer.Index({ parent: this });

			$("#deck-content-panel").html(this._viewer.el);
		},

		addImage: function(imageData) {
			var slide = new Slide.List({ imgSrc: imageData });

			$("#deck-preview-panel").append(slide.el)

			this._slides.push(slide);
		}
	});

	return Deck;
});