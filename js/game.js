
/////////////////////////
// GAME INITIALIZATION //
/////////////////////////

var Game = {};

Game.Load = function(){
  Game.version='0.0.2';
  Game.changeLog=
  '<p><h2>0.0.2 Alpha</h2><br>First "building" is added! Get the gathering going!<br>Game Loop is in place<br>Seconds Counter added</p>'+
  '<p><h2>0.0.1 Alpha</h2><br>Yay! Game is launched! Only local development tho... :(<br>Main currency added</p>';

  // Variables //

  Game.money=0;
  Game.emotes=0;
  Game.followers=0;
  Game.viewersRatio=0.05;

  // Buildings //

  Game.viewers=0;
  Game.viewerCost=1;
  Game.viewerDisplayCost=1;

  // Updates //

  // Actions //

  Game.Actions = [
  	{tag: 'redditPost', name: 'Reddit Post', initialCost: 10, timesUsed: 0},
  	{tag: 'keyGiveaway', name: 'Key Giveaway', initialCost: 20, timesUsed: 0}
  ];

}

Game.Load();

////////////////
// VUE OBJECT //
////////////////

var vm = new Vue({
  el: '#game',
  data: {
    Game: Game
  },
  methods:{
    cycle: function(){
      Game.money+=Game.viewers*0.01;
    },
    buyCursor: function(){
      var viewerCost = Math.floor(1 * Math.pow(1.1,Game.viewers));
      if(Game.money >= viewerCost){
        Game.viewers++;
        Game.money-=viewerCost;
      }
      Game.viewerDisplayCost = Math.floor(1 * Math.pow(1.1,Game.viewers));
    }
  }
});



///////////////
// GAME START //
///////////////

window.setInterval(function(){
  vm.cycle();
}, 1000);