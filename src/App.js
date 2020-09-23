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
            worldWidth: 0,
            worldHeight: 0,
        };
    }

    componentDidMount() {
        this.setWorld();
        window.addEventListener("resize", () => {
            this.setWorld();
        });
    }

    setWorld = () => {
        let width = window.innerWidth, height = window.innerHeight;
        let worldWidth = Math.floor(width * 0.8 / 10);
        let worldHeight = Math.floor(height * 0.6 / 10);
        this.setState({
            board: new Array(worldHeight).fill(new Array(worldWidth).fill(false)),
            worldWidth: worldWidth,
            worldHeight: worldHeight,
            running: false,
        });
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
            let neighborX = (x + direction[0]), neighborY = (y + direction[1]);
            neighborX = ((neighborX % this.state.worldWidth) + this.state.worldWidth) % this.state.worldWidth;
            neighborY = ((neighborY % this.state.worldHeight) + this.state.worldHeight) % this.state.worldHeight;
            if (this.state.board[neighborY][neighborX]) {
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
        this.setState({board: new Array(this.state.worldHeight).fill(new Array(this.state.worldWidth).fill(false))});
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
                            min="10" max="3000"
                            value={this.state.tickRate}
                            onChange={(e) => {this.setState({tickRate: e.target.value})}}
                            step="10"
                        />
                    </div>
                </div>
                <div className="templates">
                    <div className="about">
                        <h1>What is Conway's Game of Life</h1>
                        <p>
                            Simply put, it's a game that shows that complex patterns can emerge when an defined initial
                            state is constrained by a simple set of rules. For a real explanation, visit the
                            game's <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Wikipedia page</a>.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
