var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');
var URL = 'http://instafood.meteor.com/getFavorites/?username=taurn';
var user = '';
var password = '';
var configURL = '';

Settings.config({
    url:configURL
  },
  function (e){
  
  },
  function (e){
  
});

var initCard = new UI.Card({
  title:'Instafood',
  body:'Please login in continue...'
});
initCard.show();
initCard.on('click', 'select', function (e){
  var splashCard = new UI.Card({
    title:'Instafood',
    subtitle:'Fetching your favorites...'
  });
  splashCard.show();
  initCard.hide();
  
  ajax(
  {
    url: URL,
    type: 'json'
  },
  function (data){
    var tempFoods = data.favorites;
    var favFoods = [];
    tempFoods.forEach(function(a){
      favFoods.push({
        title:a,
        subtitle:'Restaurant X'
      });
    });
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Favorite Foods',
        items: favFoods
      }]
    });
    resultsMenu.show();
    splashCard.hide();
    resultsMenu.on('select', function (e){
        var stuff = e.item.title +' @ '+ e.item.subtitle;
        var confirm = new UI.Card({
          title:'Confirm Purchase',
          subtitle:'Total Cost: $6.00',
          body:stuff
        });
        confirm.show();
        confirm.on('click', function (a){
          var complete = new UI.Card({
            title:'Order Placed',
            body:'ETA: 30 mins'
          });
          complete.show();
          confirm.hide();
        });
    });
    },
    function (error){
      var errorCard = new UI.card({
        title:'Error',
        body:'Oops... loooks like somebody messed up.'
      });
      errorCard.show();
    }
  );
});