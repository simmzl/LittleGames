(function () {

    //player object
    function Player(name, el) {
        this.name = name;
        //$区别变量名，更易区分，不加也可,加了前后就要保持一致
        this.$el = el;
        this.active = false;
        this.$red = this.$el.querySelector('.active');
    }

    //渲染背景
    Player.prototype.render = function () {
        this.$el.style.backgroundImage = "url(./img/anima/" + this.name + ".svg)";
    };

    //随机获取动物角色
    Player.random = function (exclude) {
        var players = new Array(24), i = players.length;
        while (i--) {
            players[i] = i;
        }
        // console.log(players);

        //exclude the same name
        if (exclude) {
            players = players.filter(function (player) {
                return player !== exclude
            });
        }
        return players[Math.floor(Math.random() * players.length)];
    };

    //将获取的动物角色赋予玩家name,渲染
    Player.prototype.reset = function (name) {
        this.name = name;
        this.render();
    };

    Player.prototype.setActive = function (e) {
        //自身状态设为true,子级red显示出来,!!设为true,!设为相反，!true:false;!false:true
        this.active = !!e;
        this.$red.hidden = !e;
    };

    //Square object
    function Square(el) {
        this.$el = el;
        this.val = 0;
    }

    Square.prototype.setBI = function (name, val) {
        //判断如果方格已被写入BI，则return true
        if (this.$el.style.backgroundImage.length > 1) return true;
        this.val = val;
        this.$el.style.backgroundImage = "url(./img/anima/" + name + ".svg)";
        return false;
    };

    Square.prototype.resetALLSquare = function () {
        this.val = 0;
        this.$el.style.backgroundImage = "";
    };

    //game object
    function Game(el) {
        //实例两个玩家
        this.p1 = new Player(Player.random(), document.querySelector('#p1'));
        this.p2 = new Player(Player.random(this.p1.name), document.querySelector('#p2'));
        this.$el = el;

        //展示players
        this.p1.render();
        this.p2.render();

        //选择出dice
        this.dice1 = document.querySelector('#dice1');
        this.dice2 = document.querySelector('#dice2');
        this.dice1.addEventListener('click', this.clickDice.bind(this));
        this.dice2.addEventListener('click', this.clickDice.bind(this));

        //选择出遮罩/start按钮/restart按钮/winner/logo
        this.$mask = document.querySelector('.mask');
        this.$start = document.querySelector('.start');
        this.$start.addEventListener('click', this.letStart.bind(this));
        this.$restart = document.querySelector('.restart');
        this.$restart.disabled = true;
        this.$restart.addEventListener('click', this.clickRestart.bind(this));
        this.$winner = document.querySelector('.winner');

        // 类数组转化为数组
        var $squares = [].slice.call(document.querySelectorAll('.square'));
        //解决forEach内无法用this
        var onClickSquare = this.clickSquare.bind(this);
        //遍历加入事件
        $squares.forEach(function (t) {
            t.addEventListener('click', onClickSquare)
        });
        this.squares = $squares.map(function (e) {
            return new Square(e);
        });
    }

    //骰子随机切换玩家角色
    Game.prototype.clickDice = function (e) {
        if (e.target.matches('#dice1')) this.p1.reset(Player.random(this.p1.name));
        if (e.target.matches('#dice2')) this.p2.reset(Player.random(this.p2.name));
        this.p1.name === this.p2.name ? this.$start.disabled = true : this.$start.disabled = false;
    };

    Game.prototype.clickSquare = function (e) {
        // 判断游戏是否结束
        if (this.end()) return;
        //获取当前点击element更改BImage,val & active状态,当setBI()返回true（已被写入BI）,则无法状态；
        //dataset选取HTML5自定义data-*属性；
        if (this.squares[e.target.dataset.index].setBI(this.p1.active ? this.p1.name : this.p2.name, this.p1.active ? 1 : -1)) return;

        if (this.p1.active) {
            this.p1.setActive(false);
            this.p2.setActive(true);
        } else {
            this.p2.setActive(false);
            this.p1.setActive(true);
        }

        if (this.winner()) {
            this.showWinner();
        }
    };

    Game.prototype.allSquareUsed = function () {
        // find()找到则返回第一个找到元素，否则返回undefined;filter();!undefined = true
        return !this.squares.find(function (items) {
            return items.val === 0;
        });
    };

    // 判断并返回获胜者
    Game.prototype.winner = function () {
        var wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
        ];
        var result = [];
        for (var i = 0; i < wins.length; i++) {
            var temp;
            temp = this.squares[wins[i][0]].val + this.squares[wins[i][1]].val
                + this.squares[wins[i][2]].val;
            result.push(temp);
        }
        // return result;
        //玩家1获胜
        if (result.find(function (item) {
                return item === 3;
            })) return this.p1;
        //玩家2获胜
        if (result.find(function (item) {
                return item === -3;
            })) return this.p2;
    };

    Game.prototype.end = function () {
        return !!this.winner() || this.allSquareUsed();
    };

    Game.prototype.showWinner = function () {
        this.$mask.classList.add('mini');
        this.$winner.hidden = false;
        this.$mask.hidden = false;
        var win = this.winner();
        var a = document.querySelector('#logo');
        this.p1.setActive(!this.p1.active);
        this.p2.setActive(!this.p2.active);
        a.style.backgroundImage = "url(./img/anima/" + win.name + ".svg)";

        // 一个很好的技巧使用this
        //设置延时动画
        var self = this;
        setTimeout(function () {
            self.$mask.classList.remove('mini');
        }, 100)
    };

    Game.prototype.clickRestart = function () {
        this.dice1.hidden = false;
        this.dice2.hidden = false;
        this.p1.setActive(false);
        this.p2.setActive(false);
        this.$start.hidden = false;
        this.$mask.hidden = false;
        this.$winner.hidden = true;
        this.resetSquares();
        this.$restart.disabled = true;
    };
    Game.prototype.resetSquares = function () {
        // this.squares.forEach(function (t) {
        //     t.resetALLSquare();
        // })
        this.squares.forEach(function (square) {
            square.resetALLSquare();
        });
    };
    // Game开始，设置状态
    Game.prototype.letStart = function () {
        this.$start.hidden = true;
        this.dice1.hidden = true;
        this.dice2.hidden = true;
        this.$mask.hidden = true;
        this.$restart.disabled = false;
        this.p1.setActive(true);
        this.p2.setActive(false);
    };
    document.addEventListener('DOMContentLoaded', function () {
        window.game = new Game(document.querySelector('.container'));
    })
}());