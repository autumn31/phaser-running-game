import "phaser";
import { config } from "./menu";
import carrot from "./carrot";
import trap from "./trap";

export default class mainScene extends Phaser.Scene {
  constructor() {
    super({ key: "mainScene" });
  }
  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("platform", "assets/wood.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("carrot", "assets/carrot.png");
    this.load.image("trap", "assets/needle.png");
    this.load.image("sky", "assets/sky.png");
    this.load.spritesheet("car", "assets/car5.png", {
      frameWidth: 100,
      frameHeight: 68,
    });
  }

  create() {
    this.gameOver = false;
    this.sky = this.add.tileSprite(350, 150, 700, 300, "sky");

    this.score = 0;
    this.scoreText = this.add.text(20, 20, "score: " + this.score, {
      font: "20px Arial",
      fill: "#fff",
    });

    var ground = this.physics.add.staticImage(350, 285, "ground");
    ground.scaleX = 5;
    // group with all active platforms.
    this.platformGroup = this.add.group({
      // once a platform is removed, it's added to the pool
      removeCallback: function (platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    // pool
    this.platformPool = this.add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: function (platform) {
        platform.scene.platformGroup.add(platform);
      },
    });

    // number of consecutive jumps made by the player
    this.playerJumps = 0;

    // adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(config.width, config.width / 2);

    // adding the player;
    this.player = this.physics.add.sprite(50, 50, "car");
    this.player.setScale(0.5);
    this.player.setGravityY(gameOptions.playerGravity);
    this.anims.create({
      key: "car",
      frames: this.anims.generateFrameNumbers("car"),
      frameRate: 5,
      repeat: -1,
    });

    // setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platformGroup);

    this.physics.add.collider(this.player, ground);

    // checking for input
    this.input.keyboard.on("keydown-SPACE", this.startJump, this);
    this.input.keyboard.on("keyup-SPACE", this.endJump, this);

    this.carrots = this.physics.add.group({
      classType: carrot,
      maxSize: 20,
      runChildUpdate: true,
    });
    this.physics.add.overlap(
      this.player,
      this.carrots,
      (p, c) => {
        if (c.visible) {
          c.remove();
          this.score += 10;
          this.scoreText.setText("score: " + this.score);
        }
      },
      null,
      this
    );

    this.traps = this.physics.add.group({
      classType: trap,
      maxSize: 20,
      runChildUpdate: true,
    });
    this.physics.add.overlap(this.player, this.traps, this.caught, null, this);
  }

  addPlatform(platformWidth, posX) {
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      platform = this.physics.add.sprite(posX, 200, "platform");
      platform.setImmovable(true);
      platform.setVelocityX(gameOptions.platformStartSpeed * -1);
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    platform.displayHeight = 30;
    this.nextPlatformDistance = Phaser.Math.Between(
      gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]
    );
  }

  // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
  startJump() {
    if (this.player.body.touching.down) {
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.player.setGravityY(gameOptions.playerGravity / 2);
    }
  }
  endJump() {
    this.player.setGravityY(gameOptions.playerGravity);
  }
  update() {
    if (this.gameOver) {
      return;
    }
    this.sky.tilePositionX += 2;

    this.player.anims.play("car", true);
    // game over
    if (this.player.y > config.height) {
      this.scene.start("mainScene");
    }
    this.player.x = gameOptions.playerStartPosition;

    // recycling platforms
    let minDistance = config.width;
    this.platformGroup.getChildren().forEach(function (platform) {
      let platformDistance =
        config.width - platform.x - platform.displayWidth / 2;
      minDistance = Math.min(minDistance, platformDistance);
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      var nextPlatformWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      this.addPlatform(nextPlatformWidth, config.width + nextPlatformWidth / 2);
    }

    let maxX = 0;
    this.carrots.getChildren().forEach((carrot) => {
      if (carrot.visible) maxX = Math.max(maxX, carrot.x);
    });
    if (this.carrots.getLength() == 0 || maxX + 50 < config.width) {
      // decide generate or not
      var shift = 0;
      if (Math.random() > 0.5) {
        shift = 50;
      }
      var carrot = this.carrots.get();
      if (carrot) {
        var dy = Math.floor(Math.random() * 3);
        carrot.show(config.width + shift, 250 - 80 * dy);
        carrot.setVelocityX(gameOptions.platformStartSpeed * -1);
      }
    }

    if (Math.random() > 0.99) {
      var trap = this.traps.get();
      if (trap) {
        trap.show(config.width, 258);
        trap.setVelocityX(gameOptions.platformStartSpeed * -1);
      }
    }
  }
  caught(player) {
    // if (this.soundOn) {
    //   this.sound.play("death");
    // }
    // this.bgm.stop();
    this.physics.pause();

    player.setTint(0xff0000);
    this.gameOver = true;

    var ggText = this.add.text(
      250,
      120,
      "game over\n(Click or Space to restart)",
      {
        font: "20px Arial",
        fill: "#fff",
        align: "center",
      }
    );
    ggText.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, ggText.width, ggText.height),
      Phaser.Geom.Rectangle.Contains
    );

    ggText.on(
      "pointerdown",
      function () {
        this.restart();
      }.bind(this)
    );
    // this.scene.pause();
  }

  restart() {
    this.registry.destroy(); // destroy registry
    this.events.off(); // disable all active events
    this.gameOver = false;
    this.physics.resume();
    this.scene.restart(); // restart current scene
    this.player.disableBody(true, true);
  }
}

let gameOptions = {
  platformStartSpeed: 300,
  spawnRange: [100, 350],
  platformSizeRange: [50, 250],
  playerGravity: 1000,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 2,
};

function resize() {
  let gameDiv = document.querySelector("#game");
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let windowRatio = windowWidth / windowHeight;
  let gameRatio = config.width / config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowWidth / gameRatio + "px";
  } else {
    canvas.style.width = windowHeight * gameRatio + "px";
    canvas.style.height = windowHeight + "px";
  }
}
