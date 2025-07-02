import '../css/style.css'
import { darkModeHandle } from './utils';
import { starGame } from './game';

darkModeHandle();

const startGameBtn = document.getElementById('startGame')

startGameBtn.addEventListener('click', starGame)
