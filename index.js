const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 300;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, true, true, 3.5);

// generate cars for model training parallely
const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];
// updating the best car if we have a best brain
const bestBrain = getBestBrain();
if (bestBrain) {
  for (let i = 0; i < cars.length; i++) {
    // each car is becoming the best car
    cars[i].brain = JSON.parse(bestBrain);

    // except for the first best car mutate all others
    // this way we can find better brains
    if (i !== 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

// add traffic - multiple cars
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, false, false, 3),
  new Car(road.getLaneCenter(0), -300, 30, 50, false, false, 3),
  new Car(road.getLaneCenter(2), -300, 30, 50, false, false, 3),
  new Car(road.getLaneCenter(0), -500, 30, 50, false, false, 3),
  new Car(road.getLaneCenter(1), -500, 30, 50, false, false, 3),
  new Car(road.getLaneCenter(2), -700, 30, 50, false, false, 3),
  new Car(road.getLaneCenter(0), -700, 30, 50, false, false, 3),
];

// add random traffic
// const traffic = [];
// for (let i = 0; i < 100; i++) {
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

function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, false, true, 3.5));
  }

  return cars;
}

// save the best brain to localStorage
function saveBestBrain() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// deletes the best brain from localStorage
function discardBestBrain() {
  localStorage.removeItem("bestBrain");
}

function getBestBrain() {
  return localStorage.getItem("bestBrain");
}

animate();

// by default requestAnimation frame passes time value to this function as it is used as callback fn
function animate(time) {
  // update traffic
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic); // passing the traffic so that car can interact with the traffic
  }

  // finding the best car and selecting it i.e., the car that has the minimum y
  // as it is moving forward the most
  bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)));

  // setting height here will make sure the carCanvas remains full size even upon window change
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  // moving the road so to give the illusion as if a drone is filming from top
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7); // placing the car at safe distance to see the traffic ahead

  road.draw(carCtx);
  // draw traffic
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  // making the cars semi transparent
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  // emphasizing on the main car and only drawing sensors for this car
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  // slowing down the animation and in forward direction(-ve)
  networkCtx.lineDashOffset = -time / 50;
  // visualize the NN
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  // updates the scene based on refresh rate of the screen
  requestAnimationFrame(animate);
}
