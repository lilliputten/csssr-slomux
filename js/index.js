/* eslint-env browser, commonjs */
/* global React, ReactDOM */
/* --eslint-disable no-debugger, no-console */

// Slomux - реализация Flux, в которой, как следует из нвазвания, что-то сломано.
// Нужно выяснить что здесь сломано

/** __extends ** {{{
 */
var __extends = (this && this.__extends) || (function () {
  var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) {
          d[p] = b[p];
        }
      }
    };
  return function (d, b) {
    function __() { this.constructor = d; }
    extendStatics(d, b);
    d.prototype = (b === null) ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();/*}}}*/

/** __assign ** {{{
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p)) {
        t[p] = s[p];
      }
    }
  }
  return t;
};/*}}}*/

/** createStore ** {{{
 */
var createStore = function (reducer, initialState) {
  var currentState = initialState;
  var listeners = [];
  var getState = function () { return currentState; };
  var dispatch = function (action) {
    currentState = reducer(currentState, action);
    listeners.forEach(function (listener) {
      return listener();
    });
  };
  var subscribe = function (listener) {
    return listeners.push(listener);
  };
  var unsubscribe = function (listener) {
    var p = listeners.indexOf(listener);
    if (p !== -1) {
      listeners.splice(p, 1);
    }
    return listeners;
  };
  return {
    getState: getState,
    dispatch: dispatch,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
  };
};/*}}}*/

/** connect ** {{{
 */
var connect = function (mapStateToProps, mapDispatchToProps) {
  return function (Component) {
    return /** @class */ (function (superComponent) {
      function someClass() {
        var _this = superComponent !== null && superComponent.apply(this, arguments) || this;
        _this.handleChange = function () {
          _this.forceUpdate();
        };
        return _this;
      }
      __extends(someClass, superComponent);
      someClass.prototype.render = function () {
        return (React.createElement(
          Component,
          __assign(
            {},
            mapStateToProps(window.store.getState(), this.props),
            mapDispatchToProps(window.store.dispatch, this.props)
          )
        ));
      };
      someClass.prototype.componentDidMount = function () {
        window.store.subscribe(this.handleChange);
      };
      someClass.prototype.componentWillUnmount = function () {
        window.store.unsubscribe(this.handleChange);
      };
      return someClass;
    }(React.Component));
  };
};/*}}}*/

// NOTE: Is it safe to use global store (`window.store`) object?

/** Provider ** {{{
 */
var Provider = /** @class */ (function (superComponent) {
  __extends(Provider, superComponent);
  function Provider() {
    return superComponent !== null && superComponent.apply(this, arguments) || this;
  }
  Provider.prototype.componentWillMount = function () {
    window.store = this.props.store;
  };
  Provider.prototype.render = function () {
    return this.props.children;
  };
  return Provider;
}(React.Component));
/*}}}*/

// APP

// Actions

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

// Reducers...

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
        React.createElement('ul', null, this.props.todos.map(function (todo, idx) {
          // TODO: To generate unique key (useless now)?
          return React.createElement('li', { key: idx }, todo);
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
