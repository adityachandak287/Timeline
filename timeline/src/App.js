import React from "react";
import "./App.css";
import ChartTest from "./components/ChartTest";
import WakaChart from "./components/WakaChart";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        {/* <ChartTest></ChartTest> */}
        <WakaChart></WakaChart>
      </div>
    );
  }
}

export default App;
