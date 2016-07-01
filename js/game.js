////////////////////
// HELP FUNCTIONS //
////////////////////

function l(input, place){
  var placer = Math.pow(10, place);
  var output = Math.round(input * placer) / placer;
  return output;
}

function RInt(min, max){
  //calculates a random int between min and max
  return min + Math.floor(Math.random() * (max - min + 1));
}

function IsIn(input){
  //given a propability, returns that likely true
  return input >= Math.random();
}

/////////////////////////
// GAME INITIALIZATION //
/////////////////////////

var Game = {};

Game.Load = function(){
  Game.version = '0.0.3';
  Game.changeLog =
  '<p><h2>0.0.3 Alpha</h2><br><p>Complete rework of the structure.<br>Added an additional currency and 2 stable variables: followers and viewers.<br>New "Buildings" moderator and spambot added.</p>'+
  '<p><h2>0.0.2 Alpha</h2><br>First "building" is added! Get the gathering going!<br>Game Loop is in place<br>Seconds Counter added</p>'+
  '<p><h2>0.0.1 Alpha</h2><br>Yay! Game is launched! Only local development tho... :(<br>Main currency added</p>';

  // Variables //

    // Currencies //

    Game.money = 0;
    Game.emotes = 0;
    Game.followers = 0;
    Game.viewers = 1;

    // for the math //

    //realistic would be 0.05, but for testing we start with 0.25
    Game.viewersRatio = 0.25;
    Game.moneyPerTick = 0;
    Game.emotesPerTick = 0;
    Game.moneyEfficiency = 1;
    Game.emoteEfficiency = 1;
    Game.moderatedViewers = 0;
    Game.wildViewers = 1;
    Game.viewersMoneyPerTick = 0;
    Game.viewersEmotesPerTick = 0;

    // Timestamps //

    Game.lastViewerCount = 0;
    Game.lastGameSave = 0;

    // test

    Game.test1 = 0;

  // Buildings //

  Game.Buildings = [];

  Game.Building = function(id, name, description, baseMoneyPrice, baseEmotePrice, baseMoneyPerTick, baseEmotesPerTick, count = 0, moneyEfficiency = 1, emoteEfficiency = 1){

    // basic values //

    this.id = id;
    this.name = name;
    this.description = description;
    this.baseMoneyPrice = baseMoneyPrice;
    this.baseEmotePrice = baseEmotePrice;
    this.baseMoneyPerTick = baseMoneyPerTick;
    this.baseEmotesPerTick = baseEmotesPerTick;
    this.count = count;
    this.moneyEfficiency = moneyEfficiency;
    this.emoteEfficiency = emoteEfficiency;

    // calc functions //

    this.CalcCosts = function(){
      this.moneyCost = l(this.baseMoneyPrice * Math.pow(1.1,this.count), 2);
      this.emoteCost = Math.floor(this.baseEmotePrice * Math.pow(1.1,this.count));
    };
    this.CalcMoneyPerTick = function(){
      this.moneyPerTick = this.baseMoneyPerTick * this.count * this.moneyEfficiency;
    }
    this.CalcEmotesPerTick = function(){
      this.emotesPerTick = this.baseEmotesPerTick * this.count * this.emoteEfficiency;
    }
    this.CalcCosts();
    this.CalcMoneyPerTick();
    this.CalcEmotesPerTick();

    // other functions //

    this.IncMoneyEfficiency = function(value){
      this.moneyEfficiency *= value;
      this.CalcMoneyPerTick();
      Game.CalcMoneyPerTick();
    }
    this.IncEmoteEfficiency = function(value){
      this.emoteEfficiency *= value;
      this.CalcEmotesPerTick();
      Game.CalcEmotesPerTick();
    }

    this.Buy = function(){
      if(Game.money >= this.moneyCost && Game.emotes >= this.emoteCost){
        this.count++;
        Game.AddMoney(-this.moneyCost);
        Game.AddEmote(-this.emoteCost);
        this.CalcCosts();
        this.CalcMoneyPerTick();
        this.CalcEmotesPerTick();
        Game.CalcMoneyPerTick();
        Game.CalcEmotesPerTick();
      }
    };

    // add to array //
    Game.Buildings[this.id] = this;
  };

  new Game.Building(0, 'Spambot', 'This bot will just spam your chat. What did you expect?',1, 0, 0, 1);
  new Game.Building(1, 'Moderator', 'Moderated chat is a blessing for every streamer, but too much cannot be good.',0 ,10, 0, 0);

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
    this.CalcCosts = function(){
      this.moneyCost = l(this.baseMoneyPrice * Math.pow(1.1,this.count), 2);
      this.emoteCost = Math.floor(this.baseEmotePrice * Math.pow(1.1,this.count));
    };
    this.CalcCosts();
    this.Buy = function(){
      if(Game.money >= this.moneyCost && Game.emotes >= this.emoteCost){
        this.count++;
        Game.AddMoney(-this.moneyCost);
        Game.AddEmote(-this.emoteCost);
        this.CalcCosts();
        trigger();                                //unschoen! (glaube ich) :)
      }
    };
    Game.Actions[this.id] = this;
  };

  new Game.Action(0, 'Reddit Post', 'A post about your stream on reddit.', 0, 10, function(){
    Game.followers += RInt(10, 20);
  });
  new Game.Action(1, 'Giveaway', 'A Giveaway during your stream.', 5, 0, function(){
    Game.followers += Rint(20, 30);
  });

  // Functions //

    // Currency Calculations //

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

    // MPT / EPT //

    Game.CalcMoneyPerTick = function(){
      var moneyPerTick = 0;
      Game.Buildings.forEach(function(building){
        moneyPerTick += building.moneyPerTick;
      });
      Game.moneyPerTick = moneyPerTick * Game.moneyEfficiency;
    }
    Game.CalcEmotesPerTick = function(){
      var emotesPerTick = 0;
      Game.Buildings.forEach(function(building){
        emotesPerTick += building.emotesPerTick;
      });
      Game.emotesPerTick = emotesPerTick * Game.emoteEfficiency;
    }

    // Viewer Calculation //

    Game.CalcViewers = function(){
      var viewers = Game.followers * Game.viewersRatio;
      // +/- 10%
      var deviation = 0.9 + Math.random() / 5;
      Game.viewers = Math.round(viewers * deviation + 1);
      // mods moderate 40 to 50 viewers
      Game.moderatedViewers = Math.min(Game.viewers, RInt(Game.Buildings[1].count * 40, Game.Buildings[1].count * 50));
      Game.wildViewers = Game.viewers - Game.moderatedViewers;
      Game.viewersEmotesPerTick = Math.round(Game.moderatedViewers * 0.1 + Game.wildViewers * 0.3) * Game.emoteEfficiency;
      Game.viewersMoneyPerTick = l(Game.moderatedViewers * 0.001, 2);
    }

    Game.AddFollowers = function(){
      // testing
      // 10% of the moderated viewers are added as new followers on recalc
      // -0.1% per 10 viewers, but not lower than 0.2%
      // this means the first follower is added at 6 moderated viewers
      Game.followers += Math.round(Game.moderatedViewers * Math.max(0.002, 0.1 - 0.0001 * Game.viewers));
    }


    ////////////////
    // Game Start //
    ////////////////

    Game.Start=function(){
      Game.CalcMoneyPerTick();
      Game.CalcEmotesPerTick();
    }

    /////////////////////
    // Game Main Cycle //
    /////////////////////

    Game.Cycle=function(){
      Game.AddMoney(Game.moneyPerTick + Game.viewersMoneyPerTick);
      Game.AddEmote(Game.emotesPerTick + Game.viewersEmotesPerTick);

      var now = Date.now();
      if(Game.lastViewerCount + 5000 <= now){
        Game.CalcViewers();
        if(IsIn(0.25))
          Game.AddFollowers();
        Game.lastViewerCount = now;
      }

    }

    return true;
}




////////////////
// GAME START //
////////////////


if(Game.Load()){
  Game.Start();
  window.setInterval(function(){
    Game.Cycle();
  }, 1000);
}



////////////////
// VUE OBJECT //
////////////////

var vm = new Vue({
  el: '#game',
  data: {
    Game: Game
  }
});
