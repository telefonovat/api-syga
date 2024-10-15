import { Node } from "./Node";
export interface ComponentStyle {
  //Does it need to be nullable?
  nodeColors: { [key: Node]: string },
  edgeColors: { [key: Node]: { [key: Node]: string } },
}
