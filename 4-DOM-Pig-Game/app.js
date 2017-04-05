/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/


var scores, roundScore, activePlayer, isGamePlaying, previousDice;

init();

document.querySelector('.btn-roll').addEventListener('click', function() {
    
    if (!isGamePlaying) {
        return;
    }
    
    var dice = Math.floor(Math.random() * 6) + 1;
    document.querySelector('.dice').style.display = 'block';
    document.querySelector('.dice').src = 'dice-' + dice + '.png';

    if (dice === 1) {
        nextPlayer();
    } else {
        if (previousDice === 6 && dice === 6) {
            // clean the entire score of the activePlayer
            scores[activePlayer] = 0;
            document.querySelector('#score-' + activePlayer).textContent = '0';
            nextPlayer();

        } else {
            console.log('check');
            previousDice = dice;
            roundScore += dice;
            // ui update
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        }
    }
});

document.querySelector('.btn-hold').addEventListener('click', function() {
    
    if (!isGamePlaying) {
        return;
    }
    
    scores[activePlayer] += roundScore;
    document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
    
    if (scores[activePlayer] >= 20) {
        var classNameOfActivePlayerPlanel = '.player-' + activePlayer + '-panel';
        document.querySelector(classNameOfActivePlayerPlanel).classList.toggle('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        document.getElementById('name-' + activePlayer).textContent = "Winner!";
        document.querySelector('.dice').style.display = 'none';

        isGamePlaying = false;
    } else {
        nextPlayer();
    }
});

document.querySelector('.btn-new').addEventListener('click', init);
q
function init() {
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    isGamePlaying = true;
    previousDice = 0;
    
    // ui init
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    
    document.querySelector('.dice').style.display = 'none';
}

function nextPlayer() {
    // active player, roundScore, highlight, current-#
    activePlayer = activePlayer ? 0 : 1;
    roundScore = 0;
    previousDice = 0;

    // update ui
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.querySelector('.dice').style.display = 'none';
}
