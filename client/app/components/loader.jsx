import React from 'react';

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: "Loading..."};
  }

  componentDidMount() {
    var that = this;
    this.timeout = setTimeout(function(){
      that.setState({message: "Não foi possível processar sua requisição. Por favor, tente novamente." });
    }, 10000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render () {
      return(<div className="loader"><div className="loading"></div>
    <p className="help-block">{this.state.message}</p>
      </div>);
  }
}

export default Loader;
