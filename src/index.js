import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Center from 'react-center';
import Button from '@material-ui/core/Button';


function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

function chooseOnePlayerGame() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  ReactDOM.render(
    <ChooseCharacter />,
    document.getElementById('root')
  );
}

class ChooseNumberOfPlayers extends React.Component {
  render() {
    return (
      <Center>
      <div className="playerchoice">
        <div>
          <h1>{"Welcome to the amazing world of tic-tac-toe!"}</h1>
          <h3>{"Your adventure awaits..."}</h3>
        </div>
        <div className="numplayers">
          <div className="oneplayer">
            <Button variant="contained" color="primary" onClick={() => chooseOnePlayerGame()}>{"One player"}</Button>
          </div>
          <div className="twoplayer">
            <Button variant="contained" color="secondary" onClick={() => startTwoPlayerGame()}>{"Two players"}</Button>
          </div>
        </div>
      </div>
      </Center>
    );
  }
}

class ChooseCharacter extends React.Component {
  render () {
    return (
      <Center>
      <div className="playerchoice">
        <div>
          <h1>{"Choose your weapon!"}</h1>
        </div>
        <div className="numplayers">
          <div className="oneplayer">
            <Button variant="contained" color="primary" onClick={() => startOnePlayerGame(true)}>{"X"}</Button>
          </div>
          <div className="twoplayer">
            <Button variant="contained" color="secondary" onClick={() => startOnePlayerGame(false)}>{"O"}</Button>
          </div>
        </div>
      </div>
      </Center>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
           />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        xIsNext: true,
        isTwoPlayerGame: (this.props.humanPlayerIsX === undefined ? true: false),
        humanPlayer:     (this.props.humanPlayerIsX === undefined ? null : (this.props.humanPlayerIsX ? 'X': 'O')),
        computer:        (this.props.humanPlayerIsX === undefined ? null : (this.props.humanPlayerIsX ? 'O': 'X')),
        status:          (this.props.humanPlayerIsX === undefined ? "Next player: X" : (this.props.humanPlayerIsX ? 'Your turn': 'Computer\'s turn')),
      };
    }

    getHistoryAndSquares() {
      const history = this.state.history;
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      return [history, squares];
    }

    handleClick(i) {
      var historyAndSquares = this.getHistoryAndSquares();
      const history = historyAndSquares[0];
      const squares = historyAndSquares[1];

      //dont evaluate if we find a winner or the square clicked already has a value
      if (calculateWinner(squares) || squares[i])
        return;

      var status = this.state.status;

      //if it is a two player game, check for winner and change status.
      if (this.state.isTwoPlayerGame) {
        squares[i] = this.state.xIsNext ? 'X': 'O';
        status = 'Next player: ' + (this.state.xIsNext ? 'O' : 'X');

        var winner = calculateWinner(squares);

        if (winner) {
          if (winner === 'T')
            status = 'It\'s a tie!';
          else
            status = 'Winner: ' + winner;
        }
      }
      else {
        squares[i] = this.state.humanPlayer;
      }

      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        xIsNext: !this.state.xIsNext,
        status: status,
      });
    }

    componentDidMount() {
      //if it is one player mode, then start the game with the computer's choice on the board
      if (this.state.computer === 'X') {
        var historyAndSquares = this.getHistoryAndSquares();
        const history = historyAndSquares[0];
        const squares = historyAndSquares[1];

        var index = minimax(squares, this.state.computer).index;
        squares[index] = this.state.computer;

        this.setState({
          history: history.concat([{
            squares: squares,
          }]),
          xIsNext: !this.state.xIsNext,
          status: 'Your turn',
        });
      }
    }

    componentDidUpdate() {
      var historyAndSquares = this.getHistoryAndSquares();
      const history = historyAndSquares[0];
      const squares = historyAndSquares[1];

      let status = "Your turn ";
      //if it is a one player game, then calculate the computer's choice and play
      if ((this.state.xIsNext && this.state.computer === 'X') ||
         (!this.state.xIsNext && this.state.computer === 'O')) {

        var index = minimax(squares, this.state.computer).index;
        squares[index] = this.state.computer;

        var winner = calculateWinner(squares);

        if (winner) {
          if (winner === 'T')
            status = 'It\'s a tie!';
          else
            status = (winner === this.state.computer ? "Computer wins!" : " You won!");
        }

        this.setState({
          history: history.concat([{
            squares: squares,
          }]),
          xIsNext: !this.state.xIsNext,
          status: status,
        });
      }
    }

    handleRestartGame() {
      if (this.state.isTwoPlayerGame)
        startTwoPlayerGame();
      else
        startOnePlayerGame((this.state.humanPlayer === 'X' ? true: false));
    }

  render() {
    var historyAndSquares = this.getHistoryAndSquares();
    const squares = historyAndSquares[1];

    return (
      <Center>
      <button className="main" onClick={() => chooseNumberOfPlayers()}>
       {"Main Menu"}
      </button>
      <div className="game-info">
        <div className="status">{this.state.status}</div>
      </div>
      <div className="reset-button">
        <button className="reset" onClick={() => this.handleRestartGame()}>
         {"Restart"}
        </button>
      </div>
      <div className="game">
        <div className="game-board">
          <Board squares={squares} onClick={(i) => this.handleClick(i)}/>
        </div>
      </div>
      </Center>
    );
  }
}

function startTwoPlayerGame() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
}

function startOnePlayerGame(isHumanPlayerX) {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  ReactDOM.render(
    <Game humanPlayerIsX={isHumanPlayerX} />,
    document.getElementById('root')
  );
}

function chooseNumberOfPlayers() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  ReactDOM.render(
    <ChooseNumberOfPlayers />,
    document.getElementById('root')
  );
}

function calculateWinner(squares) {
  //winning tic-tac-toe board combinations
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

//check if no one has played yet, i.e. it is the beginning of the game
 var hasAllNullValues = squares.every(function (val) {
    return val === null;
  });

  if(hasAllNullValues)
    return null;

//check if there is at least one empty spot on the board
  var hasSomeNullValue = squares.some(function (val) {
      return val === null;
  });

//when there is no empty spot and we get here, it is a tie
  if(!hasSomeNullValue)
    return 'T';

  return null;
}

function getRemainingSpotsOnBoard(leBoard) {
  var emptyIndexes = [];

  for(var i = 0; i < leBoard.length; i++) {
    if(leBoard[i] === null)
      emptyIndexes.push(i);
  }
  return emptyIndexes;
}

var minimax = function(board, player) {
  //get all the spots on the board that have not been played in
  var emptySpotsOnBoard = getRemainingSpotsOnBoard(board);

//check to see if there are game ending states of the game(i.e. win, lose, tie)
  if (calculateWinner(board) === 'O') {
    return {score: -10};
  }
  else if (calculateWinner(board) === 'X') {
    return {score: 10};
  }
  else if (emptySpotsOnBoard.length === 0) {
    return {score: 0};
  }

  var moves = [];

  for (var i = 0; i < emptySpotsOnBoard.length; i++) {
    var move = {};
    move.index = emptySpotsOnBoard[i];

    board[emptySpotsOnBoard[i]] = player;

    if (player === 'X') { //computer is X
      var result = minimax(board, 'O');
      move.score = result.score;
    }
    else {
      var result = minimax(board, 'X');
      move.score = result.score;
    }

    board[emptySpotsOnBoard[i]] = null;
    moves.push(move);
  }

//when it is the computer's turn, loop over all the moves and choose the one with the maximum score
  var bestMove;
  if (player === 'X') {
    var bestScore = -1000000;
    for (var j = 0; j < moves.length; j++) {
      if (moves[j].score > bestScore) {
        bestScore = moves[j].score;
        bestMove  = j;
      }
    }
  }
  else {
    //when it is the human players turn, loop over all the moves and choose the one with the minimum score
    var bestScore = 1000000;
    for (var j = 0; j < moves.length; j++) {
      if (moves[j].score < bestScore) {
        bestScore = moves[j].score;
        bestMove  = j;
      }
    }
  }

  return moves[bestMove];
}

chooseNumberOfPlayers();
