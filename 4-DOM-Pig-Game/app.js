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
    
    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;
    document.querySelector('#dice1').style.display = 'block';
    document.querySelector('#dice2').style.display = 'block';
    document.querySelector('#dice1').src = 'dice-' + dice1 + '.png';
    document.querySelector('#dice2').src = 'dice-' + dice2 + '.png';
    
    if (dice1 === 1 || dice2 === 1) {
        nextPlayer();
    } else {
        if (previousDice === 6 && dice1 === 6) {
            // clean the entire score of the activePlayer
            scores[activePlayer] = 0;
            document.querySelector('#score-' + activePlayer).textContent = '0';
            nextPlayer();

        } else {
            var sumOfTwoDice = dice1 + dice2;
            previousDice = dice1;
            roundScore += sumOfTwoDice; 
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

    // null, 0, "", undefined are coreced to false
    // anything else is coreced to true
    // var threshold = document.getElementById('input-score').value;
    var threshold = document.querySelector('.final-score').value;
    
    if (!threshold) {
        threshold = 20;
    }
    
    if (scores[activePlayer] >= threshold) {
        var classNameOfActivePlayerPlanel = '.player-' + activePlayer + '-panel';
        document.querySelector(classNameOfActivePlayerPlanel).classList.toggle('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        document.getElementById('name-' + activePlayer).textContent = "Winner!";
        hideDices();
        isGamePlaying = false;
    } else {
        nextPlayer();
    }
});

document.querySelector('.btn-new').addEventListener('click', init);

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
    hideDices();
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
    hideDices();
}

function hideDices() {
    document.querySelector('#dice1').style.display = 'none';
    document.querySelector('#dice2').style.display = 'none';
}
