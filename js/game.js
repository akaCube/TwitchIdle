
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

  Game.Buildings=[];

  Game.Building=function(id, name, description, baseMoneyPrice, baseEmotePrice, count=0){
    this.id = id;
    this.name = name;
    this.description = description;
    this.baseMoneyPrice = baseMoneyPrice;
    this.baseEmotePrice = baseEmotePrice;
    this.moneyCost = baseMoneyPrice;
    this.emoteCost = baseEmotePrice;
    this.count = count;
    this.Buy = function(){
      if(Game.money >= this.moneyCost && Game.emotes >= this.emoteCost){
        this.count++;
        Game.money -= this.moneyCost;
        Game.emotes -= this.emoteCost;
        this.moneyCost = Math.floor(this.baseMoneyPrice * Math.pow(1.1,this.count));
        this.emoteCost = Math.floor(this.baseEmotePrice * Math.pow(1.1,this.count));
      }
    };
    Game.Buildings[this.id]=this;
  };

  new Game.Building(0, 'Spambot','This bot will just spam you chat. What did you think?',1,0);
  new Game.Building(1, 'Moderator','Moderated chat is a blessing for every streamer, but too much cannot be good.',0,10);

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
    Game: Game
  },
  methods:{
    cycle: function(){
      
    },
    clickMoney: function(){
      this.addMoney(0.01);
    },
    clickKappa: function(){
      this.addEmotes(1);
    },
    addMoney: function(amount){
      Game.money = Math.round((Game.money + amount) * 100) / 100;
    },
    addEmotes: function(amount){
      Game.emotes += amount;
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