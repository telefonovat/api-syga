import { Component } from "./Component"

export interface Frame {
  lineNo: number[],
  consoleLogs: string,
  components: Component[],
}
