var request = require("request");

exports.getViewerToken = function (req, res) {
	var params = {
		client_id: config.viewerAPIKey,
		client_secret: config.viewerAPISecret,
		grant_type: "client_credentials"
	};

	request.post("https://developer.api.autodesk.com/authentication/v1/authenticate", { form: params }, function(err, response, body) {
		if (err) {
			logging.error({
				model: __filename,
				action: "getViewerToken",
				msg: "Error retrieving API token",
				err: err
			});

			res.send({ code: 500, message: "Error retrieving API token" })
		}
		else {
			if (response.statusCode == 200) res.send({ code: 200, token: JSON.parse(body) });
			else res.send({ code: response.statusCode, message: "Error retrieving service token" });
		}
	});
}