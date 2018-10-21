import { BuildWorker, Calc } from './worker';
import * as ppo from './ppo/ppo'
import * as neat from './neat/neat'

(window as any).ppo = ppo;
(window as any).neat = neat;