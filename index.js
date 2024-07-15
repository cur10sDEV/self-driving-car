const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");

const car = new Car(100, 500, 30, 50);

animate();

function animate() {
  car.update();
  // setting height here will make sure the canvas remains full size even upon window change
  canvas.height = window.innerHeight;
  car.draw(ctx);
  // updates the
  requestAnimationFrame(animate);
}
