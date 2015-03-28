define([
  "require", 
  "exports", 
  "module",
  "modules/deck"
],

function(require, exports, module, Deck) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");

  module.exports = Backbone.Router.extend({
    routes: {
      "": "viewer"
    },

    viewer: function() {
        var deckView = new Deck.Index();
        
        $("#page-content").html(deckView.el);
    }
  });
});
