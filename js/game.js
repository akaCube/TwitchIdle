
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

  // Updates //

  // Actions //

}

Game.Load();

////////////////
// VUE OBJECT //
////////////////

var vm = new Vue({
  el: '#game',
  data: {
    clicks: 0,
    cursors: 0,
    cCostDisplay: 10,
    seconds: 0,
    changeLog: Game.changeLog
  },
  methods:{
    cycle: function(){
      this.seconds++;
      this.clicks = this.clicks + this.cursors;
    },
    buyCursor: function(){
      
      var cursorCost = Math.floor(10 * Math.pow(1.1,this.cursors));
      if(this.clicks >= cursorCost){
        this.cursors++;
        this.clicks = this.clicks - cursorCost;
      }
      this.cCostDisplay = Math.floor(10 * Math.pow(1.1,this.cursors));
    }
  }
});



///////////////
// GAME START //
///////////////

window.setInterval(function(){
  vm.cycle();
}, 1000);