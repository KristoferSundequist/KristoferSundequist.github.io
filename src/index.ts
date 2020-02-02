//import { BuildWorker, Calc } from './worker';
import * as ppo from './ppo/ppo'
import * as neat from './neat/neat'
import * as banditswarm from './banditswarmRaw/banditswarm'
import * as utils from './Utils'

export const canvas_width = 700;
export const canvas_height = 700;
const canv=document.createElement("canvas");
export const context = canv.getContext("2d");
canv.id = "canvasID";
canv.height = canvas_height;
canv.width = canvas_width;
canv.style.border = "thick solid black";
document.body.appendChild(canv);

const chartCanv=document.createElement("canvas");
export const chartContext = chartCanv.getContext("2d");
chartCanv.id = "chartCanv";
chartCanv.height = canvas_height;
chartCanv.width = canvas_width;
chartCanv.style.border = "thick solid black";
document.body.appendChild(chartCanv);



(window as any).ppo = ppo;
(window as any).neat = neat;
(window as any).banditswarm = banditswarm;
(window as any).utils = utils;