import mainScene from "./game.js";

class menuScene extends Phaser.Scene {
  constructor() {
    super({ key: "menuScene" });
  }

  preload() {}

  create() {
    var ggText = this.add.text(300, 150, "Start Game", {
      font: "20px Arial",
      fill: "#fff",
      align: "center",
    });
    ggText.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, ggText.width, ggText.height),
      Phaser.Geom.Rectangle.Contains
    );

    ggText.on(
      "pointerdown",
      function () {
        this.scene.switch("mainScene");
      }.bind(this)
    );
  }

  update(time, delta) {}
}

export var config = {
  type: Phaser.AUTO,
  backgroundColor: "#3498db",
  scene: [menuScene, mainScene],
  audio: {
    disableWebAudio: true,
  },
  scale: {
    mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    parent: "game",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 700,
    height: 300,
  },
  physics: { default: "arcade" },
  width: 700,
  height: 300,
  parent: "game",
};
new Phaser.Game(config);
