import '../css/style.css'
import { darkModeHandle } from './utils';
import { startGame } from './game';

darkModeHandle();

const startGameBtn = document.getElementById('startGame')

startGameBtn.addEventListener('click', startGame)
