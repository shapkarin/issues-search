
var secret = '&client_id=000000000000000000000&client_secret=000000000000000000000';

var IssuesList = React.createClass({

  render: function() {
    var createItem = function(item) {
      return (
        <div className="item">
          <a href={item['html_url']}>{item.title}</a>
          <div className="meta">
            <img src={item.user['avatar_url']}/>
            <a href={item.user['html_url']}>{item.user.login}</a> at {item['created_at']}
          </div>
          <p>{item.body}</p>
        </div>
      )
    };
    return <div className="issues-list">{this.props.items.map(createItem)}</div>;
  }

});


var Autocomplete = React.createClass({
  handleClick: function(event) {
    this.props.input.value =  $(event.target).text();
  },

  render: function() {
    var self = this,
      $input = $(this.props.input),
      offset = $input.offset(),
      _props = [];
    if(offset){
      var style = {
        left: offset.left,
        top: offset.top + $input.outerHeight() + 1,
        width: $(this.props.input).width()
      };
      _props = this.props[this.props.input.id];
    }

    var createItem = function(item, index) {
      var avatar;
      if(item['avatar_url']){
        avatar = <img width="30px" src={item['avatar_url']} />
      }
      return (
        <div className="item" key={index} onClick={self.handleClick}>
          {avatar}
          {item.name || item.login}
        </div>
      )
    };
    return <div className="autocomplete" style={style}>{_props.map(createItem)}</div>

  }

});


var App = React.createClass({

  getInitialState: function() {
    return {
      user: 'facebook',
      users: [],
      repo: 'react',
      repositories: [],
      issues: [],
      lastInput: null
    };
  },

  autocompleteSerach: function(event) {

    var self = this,
        target = event.target,
        value = target.value,
        type = target.id,
        inputValueState = type === 'users' ? { user: value } : { repo: value };

    self.setState( inputValueState );
    self.setState({ lastInput: target });

    var query = type === 'users' ? value :  value + ' user:' + this.state.user,
        url = 'https://api.github.com/search/' + type + '?q=' + encodeURIComponent(query) + secret;

    $.get(url, function(result) {
      var items = result.items, _result = [];
      for(var i = 0; i < items.length; i++){
          _result.push(items[i])
      }
      self.state[type] = _result.slice(0,9);
    });
  },

  search: function(event) {
    event.preventDefault();
    var self = this;
    var endpoint = 'https://api.github.com/repos/' + this.state.user + '/' + this.state.repo + '/issues';
    $.ajax({
      url: endpoint,
      dataType: 'jsonp',
      success: function(result) {
        self.setState(
          { issues:  JSON.parse(JSON.stringify(result.data)) }
        );
      }
    });

  },
  render: function() {
    return (
      <div className="wrapper">
        <h1>Seach GitHub Issues</h1>
        <form onSubmit={this.search} >
          <input value={this.state.user} onChange={this.autocompleteSerach} id="users"/>
          <span className="slash">/</span>
          <input value={this.state.repo} onChange={this.autocompleteSerach} id="repositories"/>
          <span className="divider"></span>
          <button type="submit" onClick={this.search}>Search</button>
        </form>
        <IssuesList items={this.state.issues} />
        <Autocomplete users={this.state.users} repositories={this.state.repositories} input={this.state.lastInput}/>
      </div>
    )
  }
});


React.render(
  <App />,
  document.getElementById('app')
);