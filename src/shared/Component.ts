import { Edge } from "./Edge";
import { Node } from "./Node";
import { ComponentStyle } from "./ComponentStyle";

export interface Component {
  nodes: Node[],
  edges: Edge[],
  style: ComponentStyle,
}
