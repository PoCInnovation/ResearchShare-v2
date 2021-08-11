import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'
import './App.css';
import * as zokrates from '../utils/Zokrates';

class App extends React.Component {
  state = {
    statusMessage: "Initialization...",
    progress: 0
  }

  componentDidMount() {
    zokrates.zokrates.then(async zokratesProvider => {
      this.setState({statusMessage: "Compiling..."});
      const artifacts = await zokrates.compile(zokratesProvider);
      this.setState({progress: 20, statusMessage: "Computing..."});
      const result = await zokrates.compute(zokratesProvider, artifacts,
          Array(32).fill("61be55a8e2f6b4e172338bddf184d6dbee29c98853e0a0485ecee7f27b9af0b4"),
          Array(4).fill("ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"));
      this.setState({progress: 40, statusMessage: "Generating keypair..."});
      const keypair = zokrates.keypair(zokratesProvider, artifacts);
      this.setState({progress: 60, statusMessage: "Generating proof..."});
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const proof = zokrates.proof(zokratesProvider, artifacts, result, keypair);
      this.setState({progress: 80, statusMessage: "Generating verifier..."});
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const verifier = zokrates.verifier(zokratesProvider, keypair);
      this.setState({progress: 100, statusMessage: "Done!"});
      console.log(result);
    });
  }

  render() {
    return (
      <div className="App">
        <div className="AppCenter">
          {this.state.statusMessage}
          <ProgressBar style={{ width: 800, height: 20 }} now={this.state.progress}/>
        </div>
      </div>
    )
  }
}

export default App;
