class Car {
  // x and y coordinates as to where to place the car initially
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // to mimic the real world cars
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 4;
    this.maxRevSpeed = -2;
    this.friction = 0.05;
    this.angle = 0.0;

    this.controls = new Controls();
  }

  // updates the car position upon change
  update() {
    this.#move();
  }

  #move() {
    // up
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    // down
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    // only change speed if it's not already max speed
    if (this.speed >= this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed <= this.maxRevSpeed) {
      this.speed = this.maxRevSpeed;
    }

    // implement friction if car is moving (forward/reverse)
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    // if speed is very slow just slow it down
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    // left and right controls should be flipped when going in opposite directions (forward and reverse)
    // also car should not rotate (left and right) if it is at rest
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      // left
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }

      // right
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    // car should move in the direction where its front is pointing
    // -ve sign because going forward i.e., up on the canvas means y decrements and same for other three directions
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  // draw the car on the canvas
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    // place car's center at x and y
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.restore();
  }
}
