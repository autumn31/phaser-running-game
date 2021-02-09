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
  width: 700,
  height: 300,
  backgroundColor: "#3498db",
  scene: [menuScene, mainScene],
  audio: {
    disableWebAudio: true,
  },
  physics: { default: "arcade" },
  parent: "game",
};
new Phaser.Game(config);
