import Phaser from "phaser";
import logoImg from "../assets/logo.png";

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  preload() {
    this.load.image("logo", logoImg);
  }

  create() {
    const logo = this.add.image(400, 150, "logo");
    let g1 = this.add.grid(960, 640);

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1
    });

    this.tweens.add({
      targets: g1,
      scaleX: 1,
      scaleY: 1,
      repeat: -1,
    });
  }
}

export default playGame;
