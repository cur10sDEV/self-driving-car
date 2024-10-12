myCanvas.height = 800;
myCanvas.width = 800;

const canvasCtx = myCanvas.getContext("2d");

const isSavedInfo = localStorage.getItem("graph");
const savedInfo = isSavedInfo ? JSON.parse(isSavedInfo) : null;
const graph = savedInfo ? Graph.load(savedInfo) : new Graph();
const viewport = new ViewPort(myCanvas);
const graphEditor = new GraphEditor(viewport, graph);

animate();

function animate() {
  viewport.reset();
  graphEditor.display();
  new Envelope(graph.segments[0], 80).draw(canvasCtx);
  requestAnimationFrame(animate);
}

function dispose() {
  graphEditor.dispose();
}

function save() {
  localStorage.setItem("graph", JSON.stringify(graph));
}
