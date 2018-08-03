import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square component renders single square button
function Square(props) {
	// Button that displays either X or O when clicked 
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

// Board component renders 9 squares to create game board
class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square value={this.props.squares[i]} 
			onClick={() => this.props.onClick(i)}
			/>
		);
	}
	// Creates the 9 squares
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

// Game component renders a game board
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// History array contains all states of board throughout game
			// Initially blank
			history: [
				{
					squares: Array(9).fill(null)
				}
			],
			// Keep track of step
			stepNumber: 0,
			// Keeps track of alternating player turns:
			// X is always player 1 so default true
			// If it's X's turn it's true, otherwise false
			xIsNext: true
		};
	}

	handleClick(i) {
		// Add state of squares to end of history
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		// Current state of the board (last entry in history)
		const current = history[history.length - 1];
		// Slice creates new copy of squares every move
		const squares = current.squares.slice();

		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat ([
				{
					squares: squares,
				}
			]),
			stepNumber: history.length,
			// Flip value to keep player turns alternating
			xIsNext: !this.state.xIsNext
		});
	}

	// Set game board to the state user chose
	jumpTo(step) {
		this.setState({
			// Update stepNumber to the step user chose
			stepNumber: step,
			// If step is even, next player is X
			xIsNext: (step % 2) === 0
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		// Maps each state of board onto button, click button to jump to board at that state
		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move :
				'Go to game start';
			return (
				// Use move number as list's key since this never changes throughout game
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});
		// Displays status of game: winner or next player's turn
		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)} 
					 />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// =========================================
ReactDOM.render(<Game />, document.getElementById('root'));

// Checks if board contains a winner: Either 3 X's or 3 O's in a row
function calculateWinner(squares) {
	// All possible winning line combinations
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

	// Check if 3 of the same symbols are in any of the winning lines
	// If winner, returns that player's symbol
	// Otherwise, returns null
	for (let i = 0; i < lines.length; i++) {
		const[a,b,c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
