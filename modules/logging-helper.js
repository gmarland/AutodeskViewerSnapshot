// database error handler
	
	exports.error = function(obj) {
		var path = require("path");
	
		var output = "";
		
		if (obj.model) output += path.basename(obj.model, ".js");
		if (obj.action) output += (" : " + obj.action);
		if (obj.msg) output += (" : " + obj.msg);
		if (obj.err) output += (" : " + obj.err.toString());
		
		if (output != "") console.log(output);
		
	}