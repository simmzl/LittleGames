(function () {

    //player object
    function Player(name,el) {
        this.name=name;
        //$区别变量名，更易区分，不加也可,加了前后就要保持一致
        this.$el=el;
        this.active=false;
    }
    Player.prototype.render = function () {
        this.$el.style.backgroundImage="url(./img/anima/"+this.name+".svg)";
    };

    Player.random = function (exclude) {
        var players = new Array(24), i=players.length;
        while(i--){players[i] = i;}
        // console.log(players);

        //exclude the same name
        if (exclude) {
            players = players.filter(function (player) { return player !== exclude });
        }
        return players[Math.floor(Math.random()*players.length)];
    };
    Player.prototype.reset = function (name) {
        this.name=name;
      this.render();
    };
    //game object
    function Game(el) {
        this.p1 = new Player(Player.random(),document.querySelector('#p1'));
        this.p2 = new Player(Player.random(this.p1.name),document.querySelector('#p2'));
        this.$el =el;

        this.p1.render();
        this.p2.render();

        this.dice1 = document.querySelector('#dice1');
        this.dice2 = document.querySelector('#dice2');
        this.dice1.addEventListener('click',this.clickDice.bind(this));
        this.dice2.addEventListener('click',this.clickDice.bind(this));
    }
    Game.prototype.clickDice = function (e) {
      //this.p1.reset(Player.random(this.p2.name));
        if (e.target.matches('#dice1')) this.p1.reset(Player.random(this.p1.name));
        if (e.target.matches('#dice2')) this.p2.reset(Player.random(this.p2.name));
    };
    document.addEventListener('DOMContentLoaded', function () {
        window.game=new Game(document.querySelector('.container'));
    })
}());