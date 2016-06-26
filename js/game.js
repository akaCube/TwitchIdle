////////////////
// VUE OBJECT //
////////////////

var vm = new Vue({
  el: '#game',
  data: {
    clicks: 0,
    cursors: 0,
    cCostDisplay: 10,
    seconds: 0 
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
// GAME LOOP //
///////////////

window.setInterval(function(){
  vm.cycle();
}, 1000);