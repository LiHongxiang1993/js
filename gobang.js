class gobangState {
    constructor(color, map) {
        this._color = color || 1;
        this._map = [];

        if (map) {
            for (let i = 0; i < map.length; i++) {
                this._map[i] = [...map[i]];
            }
        } else {
            for (let i = 0; i < 15; i++) {
                let rowmap = [];
                for (let j = 0; j < 15; j++) {
                    rowmap[j] = 0;
                }
                this._map[i] = rowmap;
            }
        }
    }

    clone() {
        return new gobangState(this._color, this._map)
    }
}
class gobangGame {
    constructor() {
        this._curState = new gobangState();
        this._gameOver = false;
        this._state = [];
        // this._color = 1;
        // this._map = [];
        for (let i = 0; i < 15; i++) {
            let rowmap = [];
            for (let j = 0; j < 15; j++) {
                rowmap[j] = 0;
            }
            this.map[i] = rowmap;
        }
    }
    get map() {
        return this._curState._map;
    }
    get color() {
        return this._curState._color;
    }
    move(i, j) {
        if (this._gameOver == true) {
            return false;
        }
        if (this.map[i][j] !== 0) {
            return false;
        }

        this._state.push(this._curState.clone());

        this.map[i][j] = this.color;
        this._curState._color = 3 - this.color;

        if (this.gameover(i, j)) {
            setTimeout(() => {
                alert(`游戏结束, ${this._color == 1 ? '黑子' : '白子'}胜出`);
            }, 100);
            // alert(`游戏结束, ${this._color == 1 ? '黑子' : '白子'}胜出！`)
        }
        return true;
    }
    regret() {
        if (this._state.length > 0) {
            this._curState = this._state.pop();
            this._gameOver = false;
        }
    }
    gameover(i, j) {
        let color = this.map[i][j];
        if (color === 0) {
            return false;
        }
        let count = 0;
        let directs = [{
                x: 1,
                y: 0
            },
            {
                x: 0,
                y: 1
            }
        ];
        for (let direct of directs) {
            count = this.countDeirect(i, j, direct.x, direct.y, color) +
                this.countDeirect(i, j, -direct.x, -direct.y, color) + 1;
            if (count >= 5) {
                this._gameOver = true;
                return true;
            }
        }

        return false;

    }
    countDeirect(i, j, x, y, color) {
        let count = 0;
        while (true) {
            i = i + x;
            j = j + y;
            if (i < 0 || i > 14 || j < 0 || j > 14) {
                break;
            }
            if (this.map[i][j] === color) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }
}

class gobangView {
    constructor(container,game) {
        this._container = container;
        this._game = game;
    }
    render() {
        this._container.innerHTML = "";
        for (let i = 0; i < this._game.map.length; i++) {
            if (i > 0) {
                this._container.appendChild(document.createElement("br"));
            }
            let rowmap = this._game.map[i];
            for (let j = 0; j < rowmap.length; j++) {
                let e = document.createElement("div");
                e.className = `cell ${rowmap[j] == 1 ? "white" : ""} ${rowmap[j] == 2 ? "black" : ""}`;

                let topleft = document.createElement("div");
                topleft.className = "topleft";
                e.appendChild(topleft);
                let topright = document.createElement("div");
                topright.className = "topright";
                e.appendChild(topright);
                let bottomleft = document.createElement("div");
                bottomleft.className = "bottomleft";
                e.appendChild(bottomleft);
                let bottomright = document.createElement("div");
                bottomright.className = "bottomright";
                e.appendChild(bottomright);


                this._container.appendChild(e);

                e.addEventListener("click", event => {
                    if (this._game.move(i, j)) {
                        this.render();
                    }
                });

            }
        }
        let btn = document.createElement("button");         
            btn.style.width="50px";
            btn.style.height="50px";
            btn.textContent="regret";
            btn.addEventListener("click",event =>{
                this._game.regret();
                this.render();
            });
            this._container.appendChild(btn);
    }
}
let container = document.getElementById("container");
let game = new gobangGame();
(new gobangView(container,game)).render();
// (new gobangView(container)).render();