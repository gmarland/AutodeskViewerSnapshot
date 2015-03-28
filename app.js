var express = require("express"),
	cookieParser = require("cookie-parser"),
	bodyParser = require("body-parser"),
	session = require("express-session"),
	path = require("path");

// Read config file

	global.config = require(path.join(__dirname, "package.json")).config;

// Instantiate Express

	var app = express();

// Configure Express			
	
	app.set("view engine", "ejs");

  	app.use("/app", express.static(__dirname + "/app"));

	// static resources that don"t need compiling
	app.use("/img", express.static(__dirname + "/assets/img"));
	app.use("/libs", express.static(__dirname + "/assets/libs"));
	app.use("/styles", express.static(__dirname + "/assets/styles"));	
	
	app.use(cookieParser());
	app.use(bodyParser({limit: '50mb'}));
	app.use(session({ secret: config.sessionID, saveUninitialized: true, resave: true }));

// Create the http server
	
	var http = require("http").createServer(app).listen(8080);

// Catch any uncaught errors that have been thrown

	process.on("uncaughtException", function(err) {
		console.log("************************** UNCAUGHT EXCEPTION: " + err);
	});

// Include the global error handler
	
	global.logging = require("./modules/logging-helper.js");

// Include the controllers

	var viewer = require("./node_data_access/controllers/viewer");

// REST Routes

	app.get("/*", function(req, res, next) {
		if (req.headers.host.match(/^www\./) != null) {
			res.redirect("http://" + req.headers.host.slice(4) + req.url, 301);
		} else next();
	});

	app.get("/", function(req,res) { 
		res.render("index");
	});

	app.get("/viewer/token", viewer.getViewerToken);