var Immutable = require('immutable');
var BaseView = require('../libs/baseview');
var Layout = require('../layouts/default.hbs');
var Hero = require('../components/hero');
var AccountMenu = require('../components/accountMenu');
var HeaderDashboard = require('../components/headerDashboard');
var Footer = require('../components/footer');

var Dashboard = BaseView.extend({

  user: null,

  name: 'Dashboard',

  Views: {
    '.js-header-wrapper': HeaderDashboard,
    '.js-footer-wrapper': Footer
  },

  template: Layout,

  init: function(options){
    this.user = options.user;

    this.addHero();
    this.addAccountMenu();
  },

  addHero: function(){
    var heroProps = Immutable.Map({
      size: "large",
      imgUrl: "http://placekitten.com/g/1000/400"
    });
    var heroOptions = {
      props: heroProps
    };

    this.addSubView(Hero, '.js-hero-wrapper', heroOptions);
  },

  addAccountMenu: function(){
    var accountMenu = {
      model: this.user
    };

    this.addSubView(AccountMenu, '.js-accountMenu-wrapper', accountMenu);
  }

});

module.exports = Dashboard;
