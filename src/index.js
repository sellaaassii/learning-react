import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Center from 'react-center';


function Square(props) {
    return (
      <button
      className="square"
      onClick={props.onClick}
      >
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
      <div>
        <button className="Oneplayer" onClick={() => chooseOnePlayerGame()}>{"One player"}</button>
        <button className="Twoplayer" onClick={() => startTwoPlayerGame()}>{"Two player"}</button>
      </div>
    );
  }
}

class ChooseCharacter extends React.Component {

  render () {
    return (
      <div>
        <button className="X" onClick={() => startOneP(true)}>{"X"}</button>
        <button className="O" onClick={() => startOneP(false)}>{"O"}</button>
      </div>
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
      };
    }

    handleClick(i) {
      const history = this.state.history;
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      console.log("yayaya " + this.state.twoPlayer)
      squares[i] = this.state.xIsNext? 'X': 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        xIsNext: !this.state.xIsNext,
      });
    }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      if(winner === 'T')
        status = 'It\'s a tie!';
      else
        status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (

      <Center>
      <button
      class="main"
      onClick={() => chooseNumberOfPlayers()}>
       {"Main menu"}
      </button>
      <div className="game-info">
        <div>{status}</div>
      </div>
      <div className="reset-button">
        <button
        class="reset"
        onClick={() => startTwoPlayerGame()}>
         {"Restart"}
        </button>
      </div>
      <div className="game">
        <div className="game-board">
          <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}/>
        </div>
      </div>
      </Center>
    );
  }
}
//============================================================================================================================
class OnePGame extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        xIsNext: true,
        isTwoPlayerGame: (this.props.humanPlayerIsX === undefined ? true: false),
        humanPlayer: (this.props.humanPlayerIsX === undefined ? null: (this.props.humanPlayerIsX ? 'X': 'O')),
        computer: (this.props.humanPlayerIsX === undefined ? null: (this.props.humanPlayerIsX ? 'O': 'X')),
        status: (this.props.humanPlayerIsX === undefined ? "Next player: X" : (this.props.humanPlayerIsX ? 'Your turn': 'Computer is computing')),
      };
    }

    handleClick(i) {
      console.log("handleClick")
      const history = this.state.history;
      const current = history[history.length - 1];
      const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
          return;
        }

        var status = this.state.status;

        if (this.state.isTwoPlayerGame) {
          squares[i] = this.state.xIsNext? 'X': 'O';
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

          var winner = calculateWinner(squares);

          if(winner) {
            if(winner === 'T')
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
      console.log("componentDidMount")
      if (this.state.computer === 'X') {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();

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
      const history = this.state.history;
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      let status = "Your turn ";
      if((this.state.xIsNext && this.state.computer === 'X') ||
        (!this.state.xIsNext && this.state.computer === 'O')) {


        var index = minimax(squares, this.state.computer).index;
        squares[index] = this.state.computer;

        var winner = calculateWinner(squares);


        if (winner) {
          if(winner === 'T')
            status = 'It\'s a tie!';
          else
            status = (winner === this.state.computer? "Computer wins!" : " You won!");
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
      if(this.state.isTwoPlayerGame){
        startTwoPlayerGame();
      } else {
        startOneP((this.state.humanPlayer === 'X' ? true: false))
      }
    }

  render() {
    console.log("render")
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    return (

      <Center>
      <button
      className="main"
      onClick={() => chooseNumberOfPlayers()}>
       {"Main menu"}
      </button>
      <div className="game-info">
        <div>{this.state.status}</div>
      </div>
      <div className="reset-button">
        <button
        className="reset"
        onClick={() => this.handleRestartGame()}>
         {"Restart"}
        </button>
      </div>
      <div className="game">
        <div className="game-board">
          <Board
          squares={squares}
          onClick={(i) => this.handleClick(i)}/>
        </div>
      </div>
      </Center>
    );
  }
}

// ========================================

chooseNumberOfPlayers();

function startTwoPlayerGame() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  ReactDOM.render(
    <OnePGame />,
    document.getElementById('root')
  );
}

function startOneP(humanPlayerIsX) {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  ReactDOM.render(
    <OnePGame humanPlayerIsX={humanPlayerIsX} />,
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

 var hasAllNullValues = squares.every(function (val) {
    return val === null;
  });

  if(hasAllNullValues)
    return null;

  var hasSomeNullValue = squares.some(function (val) {
      return val === null;
  });

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

var minimax = function(board, player){
  var emptySpotsOnBoard = getRemainingSpotsOnBoard(board);

  if(calculateWinner(board) === 'O'){
    return {score: -10};
  }
  else if(calculateWinner(board) === 'X'){
    return {score: 10};
  }
  else if (emptySpotsOnBoard.length === 0){
    return {score: 0};
  }

  var moves = [];

  for(var i = 0; i < emptySpotsOnBoard.length; i++) {
    var move = {};
    move.index = emptySpotsOnBoard[i];

    board[emptySpotsOnBoard[i]] = player;

    if(player === 'X') { //computer is X
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

  var best_move;
  if(player === 'X'){
    var best_score = -1000000;
    for(var j = 0; j < moves.length; j++){
      if(moves[j].score > best_score){
        best_score = moves[j].score;
        best_move  = j;
      }
    }
  }
  else {
    var best_score = 1000000;
    for(var j = 0; j < moves.length; j++){
      if(moves[j].score < best_score){
        best_score = moves[j].score;
        best_move  = j;
      }
    }
  }

  return moves[best_move];
}
