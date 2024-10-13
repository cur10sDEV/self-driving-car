myCanvas.height = 800;
myCanvas.width = 800;

const canvasCtx = myCanvas.getContext("2d");

const isSavedInfo = localStorage.getItem("graph");
const savedInfo = isSavedInfo ? JSON.parse(isSavedInfo) : null;
const graph = savedInfo ? Graph.load(savedInfo) : new Graph();
const world = new World(graph);
const viewport = new ViewPort(myCanvas);
const graphEditor = new GraphEditor(viewport, graph);

animate();

function animate() {
  viewport.reset();
  world.generate();
  world.draw(canvasCtx);
  canvasCtx.globalAlpha = 0.3;
  graphEditor.display();
  requestAnimationFrame(animate);
}

function dispose() {
  graphEditor.dispose();
}

function save() {
  localStorage.setItem("graph", JSON.stringify(graph));
}
