var _ = require('underscore');
var Backbone = require('backbone');
var HomePage = require('../pages/home');
var DashboardPage = require('../pages/dashboard');

var Router = Backbone.Router.extend({

  currentPage : null,

  routes: {
    '': 'home',
    'dashboard': 'dashboard'
  },

  initialize: function(options) {
    this.el = options.el;
    this.app = options.app;
    this.eventBus = this.app.eventBus;

    _.bindAll(this, '_passRoute', '_cleanupCurrentView');

    this.on('route', function(page){
      _.defer(this._passRoute, page);
    }, this);
  },

  home: function(){
    this._cleanupCurrentView();
    
    this.currentPage = (new HomePage({
      el: this.el,
      eventBus: this.eventBus
    })).render();
  },

  dashboard: function(){
    this._cleanupCurrentView();

    this.currentPage = (new DashboardPage({
      el: this.el,
      eventBus: this.eventBus,
      user: this.app.models.user
    })).render();
  },

  _passRoute: function(page){
    this.eventBus.trigger('route', page);
  },

  _cleanupCurrentView: function(){
    if(this.currentPage){
      this.currentPage.cleanup();
    }
  }

});

module.exports = Router;
