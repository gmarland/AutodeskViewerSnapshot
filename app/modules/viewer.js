define([
	"modules/viewer.services",
	"https://developer.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js",
	"jquery"
],

function(Viewer_Services) {
	var Viewer = {};

	Viewer.Index = Backbone.View.extend({
    	el: "<div>",

    	// Should be populated by the base64 URN of the model you want to view
    	_documentId: "urn:",

    	// variables for the viewer and if the viewer has currently locaded
    	_viewer: null,
    	_viewerLoaded: false,

    	// {{ Constructor }}

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

			// Get the token from the server needed to intantiate the Autodesk viewer
			Viewer_Services.GetToken(function(response) {
				if (response.code == 200) {
					var options = {
						accessToken: response.token.access_token,
						env: "AutodeskProduction"
					}

					// Initialize the viewer to the page
					Autodesk.Viewing.Initializer(options, function() {
						Autodesk.Viewing.Document.load(that._documentId, 
							function(doc) {
								// This example only is set up for the 3D viewer
								var threeDGeometry = {
									type: "geometry",
									role: "3d"
								};

								// Get all the items associated to the viewer
								var items = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), threeDGeometry, true);
							
								if (items.length > 0) {
									// We're only interested in the first item as this is the 3D model, the rest are 2D views
									var path = doc.getViewablePath(items[0]);

									if (path) {
										// Set up the model in the viewer
										that._viewer = new Autodesk.Viewing.Private.GuiViewer3D(document.getElementById("viewer"));
										// Replace the canvas in the viewer with one which preserves the drawing buffer
										that._viewer.canvas = that._viewer.canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true}).canvas	

										// initialize the viewer
										that._viewer.initialize();

										that._viewer.load(path);

										that._viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
											// The viewer is now loaded
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

		// {{ Event binding }}

		unbind: function() {
			$("#capture-image").unbind("click");
		},

		bind: function() {
			var that = this;

			// Someone wants to take a screenshot
			$("#capture-image").click(function(e) {
				e.stopPropagation();
				e.preventDefault();

				// Call the toDataURL on the viewers canvas. This will take a screenshot of the current view
				that._parent.trigger("addImage", that._viewer.canvas.toDataURL("image/png"));
			});
		},

		// {{ Destructor }}

		destroy: function() {
			this._viewer = null;
			
			$(this.el).detach();
			this.remove();
		}
	});

	return Viewer;
});