var UI = require('ui');
var ajax = require('ajax');
//var Settings = require('settings');
// var user = 'Rachel';
// var password = '';
// var configURL = '';

// Settings.config(
//   {
//     url:configURL
//   },
//   function (e){},
//   function (e){
    
// });

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
    for (var keys in data.favorites){
      favFoods.push({
        title: keys,
        subtitle: data.favorites[keys].store +' $'+ data.favorites[keys].price
      }); 
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
            url:'http://instafood.meteor.com/sendOrder/?username=Sashank&tray=' + '',
            type: 'json',
            method: 'post'
          },
          function (data){
            var complete = new UI.Card({
              title:'Order Placed',
              subtitle:'ETA: 30 mins',
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
        body:'Oops... loooks like somebody messed up.'
      });
      errorCard.show();
    }
  );
});