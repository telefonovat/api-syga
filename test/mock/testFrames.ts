import { Frame } from "src/shared/Frame";

const simpleGraph: Frame[] = [
  {
    lineNo: [0],
    consoleLogs: "",
    components:
      [{
        nodes: [1, 2, 3],
        edges: [[1, 2], [2, 3]],
        style: {
          nodeColors: {
            1: "white",
            2: "white",
            3: "white",
          },
          edgeColors: {
            1: { 2: "black" },
            2: { 3: "black" },
          },
        }
      }]
  },

  {
    lineNo: [0],
    consoleLogs: "",
    components:
      [{
        nodes: [1, 2, 3],
        edges: [[1, 2], [2, 3]],
        style: {
          nodeColors: {
            1: "black",
            2: "white",
            3: "white",
          },
          edgeColors: {
            1: { 2: "black" },
            2: { 3: "black" },
          },
        }
      }]
  },
  {
    lineNo: [0],
    consoleLogs: "",
    components:
      [{
        nodes: [1, 2, 3],
        edges: [[1, 2], [2, 3]],
        style: {
          nodeColors: {
            1: "black",
            2: "black",
            3: "white",
          },
          edgeColors: {
            1: { 2: "white" },
            2: { 3: "black" },
          },
        }
      }]
  },
  {
    lineNo: [0],
    consoleLogs: "",
    components:
      [{
        nodes: [1, 2, 3],
        edges: [[1, 2], [2, 3]],
        style: {
          nodeColors: {
            1: "black",
            2: "black",
            3: "black",
          },
          edgeColors: {
            1: { 2: "white" },
            2: { 3: "white" },
          },
        }
      }]
  },
];

export { simpleGraph };
