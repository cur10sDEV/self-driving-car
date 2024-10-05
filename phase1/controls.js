class Controls {
  constructor(userControlled) {
    this.forward = false;
    this.reverse = false;
    this.left = false;
    this.right = false;

    // add controls if user controlled
    if (userControlled) {
      this.#addEventListeners();
    } else {
      // move forward the traffic car
      this.forward = true;
    }
  }

  #addEventListeners() {
    // upon key press the objects began to move in that direction
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
      }
    };

    document.onkeyup = (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
      }
    };
  }
}
