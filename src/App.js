import React from 'react';
import './App.scss';

const HEIGHT = 40, WIDTH = 60;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            board: new Array(HEIGHT).fill(new Array(WIDTH).fill(false)),
            running: false,
            tickRate: 1000,
        };
    }

    setup = (i, j) => {
        if (!this.state.running) {
            this.setState({board: this.state.board.map((row, y) => (
                row.map((_, x) => {
                    return j === y && i === x ? !this.state.board[y][x] : this.state.board[y][x]
                })
            ))});
        }
    }

    evaluateCell = (x, y) => {
        const directions = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
        let neighboringCount = 0;
        directions.forEach((direction) => {
            let neighborX = x + direction[0], neighborY = y + direction[1];
            if ((neighborX < WIDTH && neighborX >= 0 && neighborY < HEIGHT && neighborY >= 0) && this.state.board[neighborY][neighborX]) {
                neighboringCount = neighboringCount + 1;
            }
        });
        return neighboringCount === 3 || (neighboringCount === 2 && this.state.board[y][x]);
    }

    run = () => {
        this.setState({running: true});
        this.gameTimer = setTimeout(() => {
            this.setState({board: this.state.board.map((row, y) => (
                    row.map((_, x) => {
                        return this.evaluateCell(x, y);
                    })
                ))});
            this.run();
        }, this.state.tickRate);
    }

    stop = () => {
        this.setState({running: false});
        clearTimeout(this.gameTimer);
    }

    refresh = () => {
        this.setState({board: new Array(HEIGHT).fill(new Array(WIDTH).fill(false))});
    }

    randomize = () => {
        this.setState({board: this.state.board.map((row, y) => (
                row.map((_, x) => {
                    return Math.random() >= 0.5;
                })
            ))})
    }

    render() {
        return (
            <div className="App">
                <div className="board-container">
                    <div className="board">
                        {this.state.board.map((row, y) => (
                            <div className="row" key={y}>
                                {row.map((box, x) => (
                                    <div
                                        className="box" style={{background: box ? "#f8f8f2" : "#282a36"}}
                                        onClick={() => this.setup(x, y)}
                                        key={x}
                                    >

                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="start-stop">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (this.state.running) {
                                this.stop();
                            } else {
                                this.run();
                            }
                        }}
                        style={{background: this.state.running ? "#ff5555" : "#50fa7b"}}
                        className="main"
                    >
                        {this.state.running ? "Stop" : "Start"}
                    </button>
                </div>
                <div className="controls">
                    <button
                        disabled={this.state.running}
                        onClick={(e) => {
                            e.preventDefault();
                            this.refresh();
                        }}
                    >
                        Refresh
                    </button>
                    <button
                        disabled={this.state.running}
                        onClick={(e) => {
                            e.preventDefault();
                            this.randomize();
                        }}
                    >
                        Randomize
                    </button>
                    <div className="tick-rate">
                        <p>Tick Rate {this.state.tickRate} ms</p>
                        <input
                            id="tick-rate"
                            type="range"
                            min="50" max="3000"
                            value={this.state.tickRate}
                            onChange={(e) => {this.setState({tickRate: e.target.value})}}
                            step="10"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
