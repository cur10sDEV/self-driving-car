class Car {
  // x and y coordinates as to where to place the car initially
  constructor(
    x,
    y,
    width,
    height,
    player = false,
    useBrain = false,
    maxSpeed = 4,
    color = "blue"
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // to mimic the real world cars
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed; // taking maxSpeed as input so that traffic cars have variable max speeds
    this.maxRevSpeed = -2;
    this.friction = 0.05;
    this.angle = 0.0;
    this.damaged = false;

    this.useBrain = useBrain;

    // only player's car need sensors and a brain
    if (player || useBrain) {
      this.sensor = new Sensor(this);
      // neral counts is like this input = no of rays that will provide the data, hidden layer,
      // and a output layer that has 4 neurons which will dictate car's movement in the 4 directions
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
    this.controls = new Controls(player);

    // add car image
    this.img = new Image();
    this.img.src = "car.png";

    // mask the color
    this.mask = document.createElement("canvas");
    this.mask.width = width;
    this.mask.height = height;

    const maskCtx = this.mask.getContext("2d");
    this.img.onload = () => {
      maskCtx.fillStyle = color;
      maskCtx.rect(0, 0, this.width, this.height);
      maskCtx.fill();

      maskCtx.globalCompositeOperation = "destination-atop";
      maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
    };
  }

  // updates the car position and sensors upon change
  // check for collission with traffic
  update(roadBorders, traffic) {
    // only move car if it is not damaged
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }

    if (this.sensor) {
      // sensors will still work even after the damage
      this.sensor.update(roadBorders, traffic);
      // get the offsets from the sensors readings
      const offsets = this.sensor.readings.map((s) => {
        // subracting from so to get lower value when far away from the object but
        // higher value when close to the object, kind of like the flashlight reflection
        // on the wall the closer you get the more intense the reflection
        // this is how the sensors work in the real world
        return s === null ? 0 : 1 - s.offset;
      });

      // get outputs from the NN
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);

      if (this.useBrain) {
        // the outputs from the NN will now drive the car
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #assessDamage(roadBorders, traffic) {
    // check if any of the points of the car is intersected with any of the road borders
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    // check if any of the points of the car is intersected with any of the traffic cars
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  // getting corners of the polygon and using this will draw the polygon on the canvas
  #createPolygon() {
    const points = [];
    // divided by 2 because hypotenuse is from one corner to another but we want from car's center to corner
    const rad = Math.hypot(this.width, this.height) / 2;
    // tan(p/b) gives me the angle and no need to divide as the angle remains same
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
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
    // if speed is very slow just stop the car
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
  draw(ctx, drawSensors = false) {
    // now car can draw its own sensors
    if (this.sensor && drawSensors) {
      this.sensor.draw(ctx);
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    // only draw mask if not damaged
    if (!this.damaged) {
      ctx.drawImage(
        this.mask,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.globalCompositeOperation = "multiply";
    }
    ctx.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
