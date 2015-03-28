define([
	"jquery"
],

function() {
	var Services = {};

	Services.GetToken = function(callback) {
		$.ajax({
			type: "GET",
			url: "/viewer/token",
			success: function(response) {
				if (callback) callback(response);
			}
		});
	}

	return Services;
});