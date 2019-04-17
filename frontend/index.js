"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
console.log('hello');
class App extends React.Component {
    render() {
        return <div>
            <h1>Hello React & Webpack!</h1>
        </div>;
    }
}
ReactDOM.render(<App />, document.getElementById('app'));
//# sourceMappingURL=index.js.map