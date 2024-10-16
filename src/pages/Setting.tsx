import { Component } from "react";

export default class Setting extends Component {
    state = {
        count: 0,
    };
    inc = () => {
        this.setState((prevState: { count: number }) => ({
            count: prevState.count + 1,
        }));
    };

    handleTest = () => {
        console.log(this.state.count);
    };
    render() {
        return (
            <div>
                <h1>Settings Page</h1>
                <p>{this.state.count}</p>
                <button onClick={this.inc}> handle </button> <br />
                <button onClick={this.handleTest}> handle test </button>
            </div>
        );
    }
}
