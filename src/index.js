import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import Button from 'react-bootstrap/Button'
//import ButtonNice from 'react-button-nice';

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
      <div className="game">
        <div className="game-board">
          <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
        <div className="reset-button">
        <button
        class="reset"
        onClick={() => restartGame()}>
         {"reset"}
        </button>
        </div>
      </div>
    );
  }
}

// ========================================

restartGame();

function restartGame() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  ReactDOM.render(
    <Game />,
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
