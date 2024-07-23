class NeuralNetwork {
  // neuronCount for every level like [4,6,5]
  constructor(neuronCounts) {
    // defining levels of NN
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      // output level for any layer is provided as input for another layer in forward manner
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    // calling the first level to produce its output
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    // loop through the remaining levels and updating this outputs
    // by providing the output of the previous level as input to the new level
    for (let i = 1; i < network.levles.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }

    // returning the final outputs and this will tell in what direction does the car should move
    return outputs;
  }
}

class Level {
  // a level has a layer of input neurons and a layer of output neurons, and the count might be different
  constructor(inputCount, outputCount) {
    /*
    NOTE: these inputs will be the values that we will get from the car's sensors
          and we will compute the output based on weights and biases
    */

    // we will have neurons as elements of an array for each layer
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    // every neuron will have some bias, above which it will activate/fire
    // output count is because the input layer will trigger the output layer of that level
    this.biases = new Array(outputCount);

    // connecting every input neuron to every output neuron i.e., not the case with the human brain
    // but these connections will have weights and a weight of zero will mean the same thing
    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    // now we have a shell, but in order to make the brain function these weights and biases must have some value
    // for now start with random values
    Level.#randomize(this);
  }

  static #randomize(level) {
    // setting weights
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        // for every input-output pair weight value will be between -1 and 1
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    // setting biases
    for (let i = 0; i < level.biases.length; i++) {
      // for every output neuron the bias value will be between - 1 and 1
      level.biases[i] = Math.random() * 2 - 1;
    }

    /*
    NOTE: the reason to use negative values is to simulate the condition that upon having a negative
          weight in any connection means don't act in accordance to that condition i.e., in our case 
          don't turn left or right
    */
  }

  // compute the output using feed-forward algorithm
  static feedForward(givenInputs, level) {
    // setting inputs provided by the car's sensors
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    for (let i = 0; i < level.outputs.length; i++) {
      // we calculate some kind of sum between the values of inputs and weights
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        // adding the product of jth input and weights between jth input and ith output
        sum += level.inputs[j] * level.weights[j][i];
      }

      // if the sum is greater than the bias for that output neuron
      if (sum > level.biases[i]) {
        // activate the neuron
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }

    return level.outputs;
  }
}
