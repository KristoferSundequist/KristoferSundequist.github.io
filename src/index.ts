import { BuildWorker, Calc } from './worker';
import * as ppo from './ppo/ppo'
import * as neat from './neat/neat'

export const canvas_width = 700;
export const canvas_height = 700;
const canv=document.createElement("canvas");
export const context = canv.getContext("2d");
canv.id = "canvasID";
canv.height = canvas_height;
canv.width = canvas_width;
canv.style.border = "thick solid black";
document.body.appendChild(canv);

(window as any).ppo = ppo;
(window as any).neat = neat;