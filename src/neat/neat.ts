import Genome from './Genome'
import {Game} from './../games/game_enemy_slide/Game';
import {InnovationNumberGenerator} from './InnovationNumberGenerator'

const ing = new InnovationNumberGenerator(Game.state_space_size+Game.action_space_size + Game.state_space_size*Game.action_space_size)
export const g = new Genome(Game.state_space_size, Game.action_space_size, ing)