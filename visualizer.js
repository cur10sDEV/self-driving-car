class Visualizer {
  static drawNetwork(ctx, network) {
    // define margin for left,top and get proper height and width
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    // draw levels of NN
    Visualizer.drawLevel(ctx, network.levels[0], left, top, width, height);
  }

  static drawLevel(ctx, level, left, top, width, height) {
    const right = left + width;
    const bottom = top + height;

    const nodeRadius = 18;
    const { inputs, outputs, weights } = level;

    // joining inputs to outputs
    // the reason to join before draw is because in this way the connection lines will
    // not overlap the nodes
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);

        // getting weights for connections between nodes
        const value = weights[i][j];
        // value is between -1 and 1 so abs value will be between 0 to 1;
        const alpha = Math.abs(value);
        // change color if weights are negative or positive
        const R = value < 0 ? 0 : 255;
        // G and R are same that makes yellow
        const G = R;
        // blue is opposite
        const B = value > 0 ? 0 : 255;

        ctx.lineWidth = 2;
        // so the color scheme is yellow for positive and blue for negative values with varying alpha
        // depending on the value
        ctx.strokeStyle = `rgba(${R}, ${G}, ${B}, ${alpha})`;
        ctx.stroke();
      }
    }

    // mapping inputs into the visualizer
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }

    // mapping inputs into the visualizer
    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  static #getNodeX(nodes, index, left, right) {
    const x = lerp(
      left,
      right,
      nodes.length === 1 ? 0.5 : index / (nodes.length - 1)
    );

    return x;
  }
}
