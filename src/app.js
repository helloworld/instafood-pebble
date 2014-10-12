var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');
var configURL = 'instafood.meteor.com/pebble';
var user = '';

Settings.config(
  {
    url:configURL
  },
  function (e){},
  function (e){
    var options = e.options;
    var tempuser = 'pebblejs://close#' + encodeURIComponent(JSON.stringify(options));
    Settings.data('info', tempuser);
  }
);
user = Settings.data('info');
var initCard = new UI.Card({
  title:'Instafood',
  body:'Login successful.'
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
    url: 'http://instafood.meteor.com/getFavorites/?username=Sashank',
    type: 'json',
    method:'get'
  },
  function (data){
    var favFoods = [];
    var tray = [];
    for (var keys in data.favorites){
      favFoods.push({
        title: keys,
        subtitle: data.favorites[keys].store +' $'+ data.favorites[keys].price
      }); 
      tray.push(data.favorites[keys].tray);
    }
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Favorite Foods',
        items: favFoods
      }]
    });
    resultsMenu.show();
    splashCard.hide();
    resultsMenu.on('select', function (e){
        var stuff = e.item.title +' @ '+ e.item.subtitle.split('$')[0];
        var confirm = new UI.Card({
          title:'Confirm Purchase',
          subtitle:'Total Cost: $'+e.item.subtitle.split('$')[1],
          body:stuff
        });
        confirm.show();
        confirm.on('click', function (a){
          ajax({
            url:'http://instafood.meteor.com/sendOrder/?username=Sashank&tray=' + tray[e.itemIndex],
            type: 'json',
            method: 'post'
          },
          function (s){
            var complete = new UI.Card({
              title:'Order Placed',
              subtitle:'ETA: ',
              body: stuff
            });
            complete.show();
            confirm.hide();
          }
          );
        });
    });
    },
    function (error){
      var errorCard = new UI.card({
        title:'Error',
        body:'Oops... looks like somebody messed up.'
      });
      errorCard.show();
    }
  );
});