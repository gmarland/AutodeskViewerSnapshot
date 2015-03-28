define([
	"modules/viewer.services",
	"https://developer.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js",
	"jquery"
],

function(Viewer_Services) {
	var Viewer = {};

	Viewer.Index = Backbone.View.extend({
    	el: "<div>",

    	_documentId: "urn:",

    	_viewer: null,
    	_viewerLoaded: false,

		initialize: function(options) {
			this.el.className = "full-content";

			this._parent = options.parent;

			this.render();
      	},

		render: function() {
			var that = this;

			$.get("/app/templates/viewer/index.html", function(contents) {
				that.$el.html(_.template(contents));

				that.afterRender();

				that.unbind();
				that.bind();
			}, "text");
		},

		afterRender: function() {
			var that = this;

			Viewer_Services.GetToken(function(response) {
				if (response.code == 200) {
					var options = {
						accessToken: response.token.access_token,
						env: "AutodeskProduction"
					}

					Autodesk.Viewing.Initializer(options, function() {
						Autodesk.Viewing.Document.load(that._documentId, 
							function(doc) {
								var threeDGeometry = {
									type: "geometry",
									role: "3d"
								};

								var items = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), threeDGeometry, true);
							
								if (items.length > 0) {
									var path = doc.getViewablePath(items[0]);

									if (path) {
										that._viewer = new Autodesk.Viewing.Private.GuiViewer3D(document.getElementById("viewer"));
										that._viewer.canvas = that._viewer.canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true}).canvas	

										that._viewer.initialize();

										that._viewer.load(path);

										that._viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
											that.viewerLoaded = true;
										});
									}
									else console.log("Error viewing path", items[0]);
								}
							},
							function(err) {
								console.log("Error loading document", err);
							});
					});
				}
			});
		},

		unbind: function() {
			$("#capture-image").unbind("click");
		},

		bind: function() {
			var that = this;

			$("#capture-image").click(function(e) {
				e.stopPropagation();
				e.preventDefault();

				that._parent.trigger("addImage", that._viewer.canvas.toDataURL("image/png"));
			});
		},

		destroy: function() {
			this._viewer = null;
			
			$(this.el).detach();
			this.remove();
		}
	});

	return Viewer;
});