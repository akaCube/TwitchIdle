////////////////////
// HELP FUNCTIONS //
////////////////////

function l(input, place){
  var placer = Math.pow(10, place);
  var output = Math.round(input * placer)/placer;
  return output;
}

/////////////////////////
// GAME INITIALIZATION //
/////////////////////////

var Game = {};

Game.Load = function(){
  Game.version = '0.0.2';
  Game.changeLog =
  '<p><h2>0.0.2 Alpha</h2><br>First "building" is added! Get the gathering going!<br>Game Loop is in place<br>Seconds Counter added</p>'+
  '<p><h2>0.0.1 Alpha</h2><br>Yay! Game is launched! Only local development tho... :(<br>Main currency added</p>';

  // Variables //

  Game.money = 0;
  Game.emotes = 0;
  Game.followers = 0;
  Game.viewersRatio = 0.05;
  Game.viewers = 1;
  // Buildings //

  Game.Buildings = [];

  Game.Building = function(id, name, description, baseMoneyPrice, baseEmotePrice, count = 0){
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
    Game.Buildings[this.id] = this;
  };

  new Game.Building(0, 'Spambot', 'This bot will just spam your chat. What did you expect?',1,0);
  new Game.Building(1, 'Moderator', 'Moderated chat is a blessing for every streamer, but too much cannot be good.',0,10);

  // Upgrades //

  // Actions //

  Game.Actions = [];

  Game.Action = function(id, name, description, baseMoneyPrice, baseEmotePrice, trigger, count = 0){
    this.id = id;
    this.name = name;
    this.description = description;
    this.baseMoneyPrice = baseMoneyPrice;
    this.baseEmotePrice = baseEmotePrice;
    this.moneyCost = baseMoneyPrice;
    this.emoteCost = baseEmotePrice;
    this.Trigger = trigger;
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
    Game.Actions[this.id] = this;
  };

  new Game.Action(0, 'Reddit Post', 'A post about your stream on reddit.', 0, 10, function(){
    Game.followers += Math.round(Math.random()) + 1;
  });
  new Game.Action(1, 'Key-Giveaway', 'A Key-Giveaway during your stream', 5, 0, function(){
    Game.followers += Math.round(Math.random() * 2) + 1;
  });

  // Functions //

  Game.ClickMoney = function(){
    Game.AddMoney(0.01);
  };
  Game.ClickEmote = function(){
    Game.AddEmote(1);
  };
  Game.AddMoney = function(amount){
    Game.money = l(Game.money + amount, 2);
  }
  Game.AddEmote = function(amount){
    Game.emotes += amount
  }
  Game.CalcViewers = function(){
    var viewers = Game.followers * Game.viewersRatio;
    var deviation = 0.9 + Math.random() / 5;
    Game.viewers = Math.round(viewers * deviation + 1);
  }

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
      
    }
  }
});



///////////////
// GAME START //
///////////////

window.setInterval(function(){
  vm.cycle();
}, 1000);