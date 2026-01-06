let userBoard = [];
let compBoard = [];
let userCuts = new Set();
let compCuts = new Set();
let history = [];
let gameOver = false;

function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function quitGame() {
  document.body.innerHTML =
    '<h1 style="color:white;text-align:center;margin-top:40vh">THANK YOU FOR PLAYING</h1>';
}

function toggleMusic() {
  alert("Music toggled (add audio later)");
}

function startGame(mode) {
  generateBoards();
  renderBoard();
  goTo('game');
}

function generateBoards() {
  userBoard = shuffle([...Array(25).keys()].map(n => n + 1));
  compBoard = shuffle([...Array(25).keys()].map(n => n + 1));
  userCuts.clear();
  compCuts.clear();
  history = [];
  gameOver = false;
  document.getElementById('history').innerHTML = '';
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  userBoard.forEach(num => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = num;
    cell.onclick = () => userMove(num, cell);
    board.appendChild(cell);
  });
}

function userMove(num, cell) {
  if (gameOver || userCuts.has(num)) return;
  cutNumber(num);
  cell.classList.add('cut');
  setTimeout(computerMove, 700);
}

function computerMove() {
  if (gameOver) return;
  
  // 🔥 SIGMA BOT: Only looks at OWN board
  const bestMove = findBestMove(compBoard, compCuts);
  const choice = bestMove || pickRandom(compBoard, compCuts);
  
  cutNumber(choice);
  document.querySelectorAll('.cell').forEach(c => {
    if (parseInt(c.textContent) == choice) c.classList.add('cut');
  });
}

function findBestMove(board, cuts) {
  // Check all rows/columns/diagonals for 4/5 complete
  const lines = getAllLines(board);
  
  for (let line of lines) {
    const unmarked = line.filter(pos => !cuts.has(board[pos]));
    if (unmarked.length === 1) {
      return board[unmarked[0]]; // Complete this line!
    }
  }
  return null;
}

function pickRandom(board, cuts) {
  const available = board.filter(n => !cuts.has(n));
  return available[Math.floor(Math.random() * available.length)];
}

function getAllLines(board) {
  const lines = [];
  // 5 rows
  for (let r = 0; r < 5; r++) lines.push([r*5, r*5+1, r*5+2, r*5+3, r*5+4]);
  // 5 columns  
  for (let c = 0; c < 5; c++) lines.push([c, 5+c, 10+c, 15+c, 20+c]);
  // 2 diagonals
  lines.push([0,6,12,18,24]);
  lines.push([4,8,12,16,20]);
  return lines;
}

function cutNumber(num) {
  userCuts.add(num);
  compCuts.add(num);
  history.push(num);
  document.getElementById('history').innerHTML =
    '<b>History</b><br>' + history.join(', ');
  checkWin();
}

function checkWin() {
  if (countLines(userCuts) >= 5) endGame(true);
  if (countLines(compCuts) >= 5) endGame(false);
}

function countLines(cuts, board) {  // Add board parameter
  let lines = 0;
  const linesToCheck = getAllLines(board);  // Use same line finder
  
  for (let linePositions of linesToCheck) {
    if (linePositions.every(pos => cuts.has(board[pos]))) lines++;
  }
  return lines;
}

// Update calls:
function checkWin() {
  if (countLines(userCuts, userBoard) >= 5) endGame(true);
  if (countLines(compCuts, compBoard) >= 5) endGame(false);  // Fixed!
}
function endGame(userWon) {
  gameOver = true;
  const overlay = document.getElementById('result');
  document.getElementById('resultText').textContent =
    userWon ? 'Congratulations. You Won !!!' : 'Loser, You Lose !!!!';
  overlay.classList.add('show');
}

function exposeBoard() {
  const cb = document.getElementById('computerBoard');
  cb.innerHTML = '';
  compBoard.forEach(n => {
    const d = document.createElement('div');
    d.className = 'cell';
    if (compCuts.has(n)) d.classList.add('cut');
    d.textContent = n;
    cb.appendChild(d);
  });
}
