export default class crow extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, "crow");
    this.displayWidth = 50;
    this.displayHeight = 50;
    this.anims.play("crow", true);
    this.setFlip(true, false);
  }

  show(x, y) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
  }

  update(time, delta) {
    if (this.x < -100) {
      this.remove();
    }
  }

  remove() {
    this.setActive(false);
    this.setVisible(false);
  }
}
