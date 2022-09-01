class Game {
  constructor() {
    this. movimento = false;
    this.resetButton = createButton("resetar");
  }

  grupos(grupo, sprites, imagem, scala) {
    for(var i= 0; i < sprites; i++) {
      var sprite;
      var x;
      var y;
      x = random(width / 2 - 300, width / 2 + 270);
      y = random(height / 2 - 200, -height * 4.6 - 40);

      sprite = createSprite(x, y);
      sprite.addImage(imagem);
      sprite.scale = scala;
      grupo.add(sprite)
    }

  }

  perdeu() {
    swal({
      title:"GAME OVER",
      text:"tente novamente",
      imageUrl:"https://i.pinimg.com/736x/a7/7c/92/a77c92e004deb6ff1c8074b654667b09.jpg",
      imageSize:"100x100",
      confirmeButtomText:"clique para sair"
    })
  }

  ganhou() {
    swal({
      title:`Incrível!${"\n"}Rank${"\n"}${player.ranking}`,
      text:"parabens",
      imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:"100x100",
      confirmeButtomText:"clique para sair"
    })
  }

  score() {
    image(coinImg, width - 300, height - player.positionY - 100, 32, 32)
    fill("white");
    textSize(20)
    stroke("yellow")
    text(player.score, width -250, height - player.positionY - 76);
  }
  barraGasolina() {
    image(fuelImg, width - 300, height - player.positionY, 32,32);
    rect(width - 250, height - player.positionY, player.gasolina, 20);
  }
  barraVida() {
    image(vidaImg, width - 300, height - player.positionY - 50, 32,32);
    rect(width - 250, height - player.positionY - 50, player.vida, 20);
  }

  coletarGasolina (indice) {
    cars[indice - 1].overlap(gasolina, function(collector, collected){
      collected.remove();
      player.gasolina += 10;
      player.update();
    })
    if(player.gasolina > 0 && this.movimento === true) {
      player.gasolina -= 0.32;
    }
    if(player.gasolina <= 0) {
      this.perdeu();
      gameState = 2;
    }
  }
  coletarMoedas (indice) {
    cars[indice -1].overlap(moedas, function(collector, collected){
      collected.remove();
      player.score += 5;
      player.update();
    }) 
  }
  colidirObstaculos(indice) {
    cars[indice-1].overlap(obstaculo, function(collector, collected){
      collected.remove();
      if(player.vida > 0){
        player.vida -= 20
      }
      player.update();
    })
    if(player.vida <= 0){
      this.perdeu();
      gameState = 2;
    }
  }


  resetar() {
    this.resetButton.mousePressed (()=>{
      database.ref("/").set({
        gameState:0, playerCount:0, players:{}, rank:0
      })
      window.location.reload()
    }) 
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }

  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    obstaculo = new Group()
    moedas = new Group()
    gasolina = new Group()
    this.grupos(obstaculo, 13, obsImg, 0.023)
    this.grupos(obstaculo, 13, obs2Img, 0.04)

    this.grupos(moedas, 50, coinImg, 0.08)

    this.grupos(gasolina, 20, fuelImg, 0.025)
    
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetButton.position(width - 200, height -1000);
    this.resetButton.class("customButton");
  }

  play() {
    this.handleElements();

    Player.getPlayersInfo();
    player.getRank();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.barraGasolina();
      this.barraVida();
      this.score();
      var index = 0;
      for(var plyr in allPlayers) {
        index = index +1;
        var x = allPlayers[plyr].positionX;
        var y = height - allPlayers[plyr].positionY;
        cars[index -1].position.x = x;
        cars[index -1].position.y = y;
        if(index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          //camera.position.x = cars[index -1].position.x
          camera.position.y = cars[index -1].position.y

          this.coletarGasolina(index);
          this.coletarMoedas(index);
          this.colidirObstaculos(index);
        }
      }
      this.handlePlayerControls();
      this.resetar();
      const chegada = height * 6 - 100
      if(player.positionY >= chegada){
        gameState = 2
        player.ranking +=1;
        player.update();
        player.updateRank(player.ranking);
        this.ganhou();
      }
      drawSprites();
    }
  }
  handlePlayerControls() {
    if(keyIsDown(UP_ARROW) && player.positionY < height * 6 - 40) {
      player.positionY = player.positionY +10;
      player.update();
      this.movimento = true;
    }
    if(keyIsDown(LEFT_ARROW) && player.positionX > width / 2  - 300){
      player.positionX = player.positionX -5;
      player.update();
      this.movimento = true;
    }
    if(keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 270) {
      player.positionX = player.positionX +5
      player.update();
      this.movimento = true;
    }
    if(keyIsDown(DOWN_ARROW) && player.positionY > 40) {
      player.positionY = player.positionY -3;
      player.update();
      this.movimento = true;
    }
  }
}

