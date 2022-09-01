class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.vida = 100;
    this.gasolina = 100;
    this.score = 0;
    this.ranking = 0;
  }

  addPlayer() {
    var playerIndex = "players/player" + this.index;

    if (this.index === 1) {
      this.positionX = width / 2 - 100;
    } else {
      this.positionX = width / 2 + 100;
    }

    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY
    });
  }

  getCount() {
    var playerCountRef = database.ref("playerCount");
    playerCountRef.on("value", data => {
      playerCount = data.val();
    });
  }

  getRank () {
    var rankCountRef = database.ref("rank");
    rankCountRef.on("value", data => {
      this.ranking = data.val();
    })
  }
  
  updateRank(count){
    database.ref("/").update({
      rank: count
    });
  }

  updateCount(count) {
    database.ref("/").update({
      playerCount: count
    });
  }

  static getPlayersInfo() {
    var playerInfoRef = database.ref("players");
    playerInfoRef.on("value", data => {
      allPlayers = data.val();
    });
  }
  update() {
    var playerRef = database.ref("players/player" + this.index);
    playerRef.update({
      positionX:this.positionX,
      positionY:this.positionY,
      vida:this.vida,
      rank:this.ranking,
      pontuacao:this.score,
      gasolina:this.gasolina

    })
  }
  getDistance () {
    var playerRef = database.ref("players/player" + this.index);
    playerRef.on("value", data => {
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    })
  }
}
