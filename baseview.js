var $ = require('jquery');
var _ = require('underscore');
var Immutable = require('immutable');
var Backbone = require('backbone');
Backbone.$ = $;

var BaseView = Backbone.View.extend({

  Views: null,
  subViews: null,
  state: null,
  props: null,
  model: null,
  collection: null,
  eventBus: null,
  template: null,

  init: function(){
    // overwrite this method in your instance of the baseview.
    // replaces backbone initialize
  },

  serialize: function(){
    return _.extend({}, 
      {props: this.props.toJSON()}, 
      {state: this.state.toJSON()}, 
      {model:this.model.toJSON()}, 
      {collection:this.collection.toJSON()}
    );
  },

  beforeRender: function(){
    // feel free to overwrite this view in your views
  },

  render: function() {
    this._beforeRender();

    this.renderCurrentView();
    this.renderSubviews();
    
    this._afterRender();

    return this; 
  },

  renderCurrentView: function(){
    var params;

    this.trigger('render');

    if(this.template){
      params = this.serialize();
      this.$el.html(
        this.template(params)
      );
    }
  },

  renderSubviews: function(){
    _.each(this.subViews, function(view, selector){
      if(this.$el.find(selector)[0] !== view.el){
        view.setElement(this.$el.find(selector)[0]);
      }
      view.render();
    }, this);
  },

  afterRender: function(){
    // feel free to overwrite this view in your views
  },

  // To be called before view is thrown away.  Clean up intervals, events, etc.
  // NOOP will be overriden
  cleanup: function() {
    this.cleanupSubViews();
    this._dispose(this);
    this.$el.empty();
    this.stopListening();
  },

  cleanupSubViews: function(){
    _.each(this.subViews, function(view, containerSelector){
      this._dispose(view);
    }, this);
  },

  beforeInit: function(){
    // feel free to overwrite this view in your views
  },

  // do not modify
  initialize: function(options) {
    var opt = options || {};

    this._beforeInit(opt);

    this._initData(opt);
    this.init(opt);
    this.initViews();

    this._afterInit(opt);
  },

  afterInit: function(){
    // feel free to overwrite this view in your views
  },

  initViews: function(){
    _.each(this.Views, function(View, containerSelector){

      this.subViews[containerSelector] = new View({
        eventBus: this.eventBus
      });

    }, this);
  },

  addSubView: function(View, containerSelector, optionsParent){
    var options = _.extend({}, {eventBus: this.eventBus}, (optionsParent || {}));

    this.subViews[containerSelector] = new View(options);

    return this.subViews[containerSelector];
  },

  /*
    PRIAVTE METHODS
    Do not overwrite
   */
  
  _initData: function (options) {
    this.props          = options.props || Immutable.Map({});
    this.state          = options.state || new (Backbone.Model.extend({}))();
    this.model          = options.model || new (Backbone.Model.extend({}))();
    this.collection     = options.collection || new (Backbone.Collection.extend({}))();
    this.eventBus       = options.eventBus || null;
    this.subViews       = {};
  },

  _beforeInit: function(){
    this.trigger('beforeInit');
    this.beforeInit();
  },
  _afterInit: function(){
    this.trigger('afterInit');
    this.afterInit();
  },
  
  _beforeRender: function(){
    this.trigger('beforeRender');
    this.beforeRender();
  },

  _afterRender: function(){
    this.trigger('afterRender');
    this.afterRender();
  },

  // Stole this method from Backbone v0.9.2 bleeding edge.
  // https://github.com/documentcloud/backbone/commit/3ae1af6df1b542bfb3e38f2fdfe7a471f2b830a0
  //
  // Clean up references to this view in order to prevent latent effects and
  // memory leaks.
  _dispose: function(view) {
    view.undelegateEvents();
    if (view.model) view.model.off(null, null, view);
    if (view.collection) view.collection.off(null, null, view);
    return view;
  }

});

module.exports = BaseView;
