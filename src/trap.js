export default class trap extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, "trap");
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
