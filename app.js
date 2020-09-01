let origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[ 0, 1, 2 ],
	[ 3, 4, 5 ],
	[ 6, 7, 8 ],
	[ 0, 3, 6 ],
	[ 1, 4, 7 ],
	[ 2, 5, 8 ],
	[ 0, 4, 8 ],
	[ 6, 4, 2 ]
];
const cells = document.querySelectorAll('.cell');

function startGame() {
	document.querySelector('.endgame').style.display = 'none';
	origBoard = Array.from(Array(9).keys()); //makes an array of keys, aka 0-8
	for (let i = 0; i < cells.length; i++) {
		cells[i].innterText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	window.setTimeout(function() {
		if (typeof origBoard[square.target.id] === 'number') {
			turn(square.target.id, huPlayer);
			if (!checkTie()) turn(bestSpot(), aiPlayer);
		}
	}, 500);
}

function turn(squareID, player) {
	origBoard[squareID] = player;
	document.getElementById(squareID).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []); //accumulator, element, index.   find every index that the player has played in
	let gameWon = null;
	for (let [ index, win ] of winCombos.entries()) {
		if (win.every((elem) => plays.indexOf(elem) > -1)) {
			//has the player played in ever spot that counts as a win for each combo
			gameWon = { index: index, player: player };
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = gameWon.player === huPlayer ? 'blue' : 'red';
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player === huPlayer ? 'You Win!' : 'You Lose!');
}

function emptySquares() {
	return origBoard.filter((s) => typeof s === 'number');
}

function bestSpot() {
	return emptySquares()[0];
}

function declareWinner(who) {
	document.querySelector('.endgame').style.display = 'block';
	document.querySelector('.endgame .text').innerText = who;
}

function checkTie() {
	if (emptySquares().length === 0) {
		for (let i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = 'green';
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner('Tie Game!');
		return true;
	}
	return false;
}

document.querySelector('#replayBtn').addEventListener('click', startGame());

startGame();
