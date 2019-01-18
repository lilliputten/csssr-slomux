/* eslint-env browser */
/* global React, ReactDOM */
/* global __extends, connect, Provider, createStore */
/* --eslint-disable no-debugger, no-console */

// APP

// actions
var ADD_TODO = 'ADD_TODO';

// Action creators
/** addTodo ** {{{
 */
var addTodo = function (todo) {
  return ({
    type: ADD_TODO,
    payload: todo
  });
};/*}}}*/

/** reducer ** {{{
 */
var reducer = function (stateList, action) {
  // if (stateList === void 0) {
  if (!Array.isArray(stateList)) {
    stateList = [];
  }
  switch (action.type) {
    case ADD_TODO:
      stateList.push(action.payload);
      return stateList;
    default:
      return stateList;
  }
};/*}}}*/

/** ToDoComponent ** {{{
 */
var ToDoComponent = /** @class */ (function (superComponent) {
  __extends(ToDoComponent, superComponent);
  function ToDoComponent() {
    var _this = superComponent !== null && superComponent.apply(this, arguments) || this;
    _this.state = {
      todoText: '',
    };
    // Bind handlers...
    _this._addTodo = _this.addTodo.bind(_this);
    _this._updateText = _this.updateText.bind(_this);
    return _this;
  }
  ToDoComponent.prototype.render = function () {
    // NOTE: Adding binded event handlers!
    return (React.createElement('div', null,
      React.createElement('label', null, this.props.title || 'Без названия'),
      React.createElement('div', null,
        React.createElement('input', {
          value: this.state.todoText,
          placeholder: 'Название задачи',
          onChange: this._updateText,
        }),
        React.createElement('button', { onClick: this._addTodo }, 'Добавить'),
        React.createElement('ul', null, this.props.todos.map(function (todo/* , idx */) {
          return React.createElement('li', null, todo);
        })))
    ));
  };
  ToDoComponent.prototype.updateText = function (e) {
    var value = e.target.value;
    // this.state.todoText = value; // NOTE: Error!
    this.setState({ todoText: value });
  };
  ToDoComponent.prototype.addTodo = function () {
    this.props.addTodo(this.state.todoText);
    // this.state.todoText = ''; // NOTE: Error!
    this.setState({ todoText: '' });
  };
  return ToDoComponent;
}(React.Component));/*}}}*/

/*{{{ Create app... */

var ToDo = connect(
  // mapStateToProps
  function (state) {
    return ({
      todos: state,
    });
  },
  // mapDispatchToProps
  function (dispatch) {
    return ({
      addTodo: function (text) {
        return dispatch(addTodo(text));
      },
    });
  }
)(ToDoComponent);

// init
ReactDOM.render(
  React.createElement(
    Provider, // Component
    { store: createStore(reducer, []) }, // Props
    React.createElement(ToDo, { title: 'Список задач' }) // Children
  ),
  document.getElementById('app')
);

/*}}}*/
