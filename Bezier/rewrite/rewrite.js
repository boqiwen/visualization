import { Circle } from './CanvasEventSystem/shape/Circle.js';
import { Line } from './CanvasEventSystem/shape/Line.js';
import { Stage } from './CanvasEventSystem/Stage.js';

const canvasBox = document.querySelector("#canvasBox");

let circle = new Circle({
  x: 100,
  y: 100,
  r: 20,
}),
  line = new Line({}),
  stage = new Stage(canvasBox);

stage.add(circle);
stage.add(line);