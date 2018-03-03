import React from 'react';
import {hashHistory} from 'react-router';
import Alert from 'react-s-alert';
import Loader from './loader.jsx';

class EditArticle extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {body: "",title: "", topic_id: "", topics: [], loading: true};
  }

  handleChange() {
    this.setState({body: this.refs.body.value, title: this.refs.title.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var body = this.refs.body.value;
    var title = this.refs.title.value;
    var topicId = this.refs.topic.value;
    var what_changed = this.refs.what_changed.value;
    if(body && title && topicId && what_changed) {
          var myHeaders = new Headers({
              "Content-Type": "application/x-www-form-urlencoded",
              "x-access-token": window.localStorage.getItem('userToken')
          });
          var myInit = { method: 'PUT',
                     headers: myHeaders,
                     body: "id="+this.props.params.articleId+"&title="+encodeURIComponent(title)+"&body="+encodeURIComponent(body)+"&topic_id="+topicId+"&user_id="+window.localStorage.getItem("userId")+"&what_changed="+what_changed
                     };
          var that = this;
          fetch('/api/articles/',myInit)
          .then(function(response) {
            return response.json();
          })
          .then(function(response) {
            if(response.error.error)
              Alert.error(response.error.message);
            else {
                Alert.success("Artigo atualizado com sucesso.");
                hashHistory.push('article/'+that.props.params.articleId);
            }
          });
    }
    else {
      Alert.error("É necessário preencher o título, conteúdo, assunto e mudanças.");
    }
  }


  componentDidMount() {
    var myHeaders = new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": window.localStorage.getItem('userToken')
    });
    var myInit = { method: 'GET',
               headers: myHeaders,
               };
    var that = this;
    fetch('/api/articles/'+this.props.params.articleId,myInit)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      if(response.error.error)
        Alert.error(response.error.message);
      else {
        that.setState({body: response.data.body, title: response.data.title, topic_id: response.data.topic_id})
      }
      that.setState({loading: false});
    });
    var myHeaders = new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": window.localStorage.getItem('userToken')
    });
    var myInit = { method: 'GET',
               headers: myHeaders,
               };
    var that = this;
    fetch('/api/topics',myInit)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      if(response.error.error)
        Alert.error(response.error.message);
      else {
        that.setState({topics: response.data})
      }
    });
  }

  render() {
    if(this.state.loading)
      return <Loader/>;
    else
      return (
        <div className="new-article">
          <div className="row">
            <div className="col-md-12">
              <input
                onChange={this.handleChange}
                ref="title"
                className="form-control input-title"
                value={this.state.title}
                 />
           </div>
           </div>
           <br/>
           <div className="row">
            <div className="col-md-12 new-article-form">
              <trix-toolbar id="my_toolbar"></trix-toolbar>
          <trix-editor toolbar="my_toolbar" input="my_input" placeholder="Comece a digitar aqui.." class="input-body"></trix-editor>
          <input id="my_input" type="hidden" value={this.state.body} ref="body" onChange={this.handleChange}/>
                 <br/>
                 <label>Escolha o assunto</label>
                 <select className="form-control topic-select" ref="topic" defaultValue={this.state.topic_id}>
                   {this.state.topics.map(topic => (
                     <option value={topic.id} key={topic.id}>{topic.name}</option>
                   ))}
                 </select>
                 <br/>
                 <div className="whatwrapper">
                 <label>O que você mudou ao editar?</label>
                 <textarea
                   ref="what_changed"
                   className="form-control what_changed what"
                   id="what"
                   placeholder="Exemplo: corrigi um erro, atualizei informação x"
                    />
                  <p className="help-block">Descreva de forma simples :)</p>
                  </div>
                  <br/>
            </div>

        <div className="row">
          <div className="col-md-12">
            <button className="btn btn-default btn-block btn-lg" onClick={this.handleSubmit}>Atualizar Artigo</button>
          </div>
        </div>
      </div>
      </div>
      );
  }
}

export default EditArticle;
