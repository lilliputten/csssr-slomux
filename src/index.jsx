/* eslint-env es6, browser */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Slomux - реализация Flux, в которой, как следует из нвазвания, что-то сломано.
// Нужно выяснить что здесь сломано

const createStore = (reducer, initialState) => {
  let currentState = initialState
  const listeners = []

  const getState = () => currentState
  const dispatch = action => {
    currentState = reducer(currentState, action)
    listeners.forEach(listener => listener())
  }

  const subscribe = listener => listeners.push(listener)

  const unsubscribe = listener => {
    const p = listeners.indexOf(listener)
    if (p !== -1) {
      listeners.splice(p, 1)
    }
    return listeners
  }

  return { getState, dispatch, subscribe, unsubscribe }
}

const connect = (mapStateToProps, mapDispatchToProps) =>
  Component => {
    return class extends React.Component {
      render() {
        return (
          <Component
            {...mapStateToProps(window.store.getState(), this.props)}
            {...mapDispatchToProps(window.store.dispatch, this.props)}
          />
        )
      }

      componentDidMount() {
        window.store.subscribe(this.handleChange)
      }

      componentWillUnmount() {
        window.store.unsubscribe(this.handleChange)
      }

      handleChange = () => {
        this.forceUpdate()
      }
    }
  }

class Provider extends React.Component {
  componentWillMount() {
    window.store = this.props.store
  }
  render() {
    return this.props.children
  }
}

// APP

// actions
const ADD_TODO = 'ADD_TODO'

// action creators
const addTodo = todo => ({
  type: ADD_TODO,
  payload: todo,
})

// reducers
const reducer = (state = [], action) => {
  switch(action.type) {
    case ADD_TODO:
      state.push(action.payload)
      return state
    default:
      return state
  }
}

// components
class ToDoComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      todoText: '',
    }
    // NOTE: Bind handler events
    this._addTodo = this.addTodo.bind(this)
    this._updateText = this.updateText.bind(this)
  }

  render() {
    return (
      <div>
        <label>{this.props.title || 'Без названия'}</label>
        <div>
          <input
            value={this.state.todoText}
            placeholder="Название задачи"
            onChange={this._updateText}
          />
          <button onClick={this._addTodo}>Добавить</button>
          <ul>
            {this.props.todos.map((todo, idx) => <li key={idx}>{todo}</li>)}
          </ul>
        </div>
      </div>
    )
  }

  updateText(e) {
    const { value } = e.target

    // this.state.todoText = value // NOTE: Error
    // Correct setState call
    this.setState({ todoText: value })
  }

  addTodo() {
    this.props.addTodo(this.state.todoText)

    // this.state.todoText = '' // NOTE: Error
    // Correct setState call
    this.setState({ todoText: '' })
  }
}

const ToDo = connect(state => ({
  todos: state,
}), dispatch => ({
  addTodo: text => dispatch(addTodo(text)),
}))(ToDoComponent)

// init
ReactDOM.render(
  <Provider store={createStore(reducer, [])}>
    <ToDo title="Список задач"/>
  </Provider>,
  document.getElementById('app')
)
