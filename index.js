const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 300;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, true, true, 3.5);

// add traffic - multiple cars
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, false, false, 3)];

// add random traffic
// const traffic = [];
// for (let i = 0; i < 1000; i++) {
//   traffic.push(
//     new Car(
//       road.getLaneCenter(Math.floor(Math.random() * 1000000) % road.laneCount),
//       -100 - i * 100,
//       30,
//       50,
//       false,
//       false,
//       3
//     )
//   );
// }

animate();

function animate() {
  // update traffic
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic); // passing the traffic so that car can interact with the traffic
  // setting height here will make sure the carCanvas remains full size even upon window change
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  // moving the road so to give the illusion as if a drone is filming from top
  carCtx.translate(0, -car.y + carCanvas.height * 0.7); // placing the car at safe distance to see the traffic ahead

  road.draw(carCtx);
  // draw traffic
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  car.draw(carCtx, "blue");

  carCtx.restore();

  // visualize the NN
  Visualizer.drawNetwork(networkCtx, car.brain);
  // updates the scene based on refresh rate of the screen
  requestAnimationFrame(animate);
}
