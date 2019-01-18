// Slomux - реализация Flux, в которой, как следует из нвазвания, что-то сломано.
// Нужно выяснить что здесь сломано
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var createStore = function (reducer, initialState) {
    var currentState = initialState;
    var listeners = [];
    var getState = function () { return currentState; };
    var dispatch = function (action) {
        currentState = reducer(currentState, action);
        listeners.forEach(function (listener) { return listener(); });
    };
    var subscribe = function (listener) { return listeners.push(listener); };
    return { getState: getState, dispatch: dispatch, subscribe: subscribe };
};
var connect = function (mapStateToProps, mapDispatchToProps) {
    return function (Component) {
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.handleChange = function () {
                    _this.forceUpdate();
                };
                return _this;
            }
            class_1.prototype.render = function () {
                return (React.createElement(Component, __assign({}, mapStateToProps(store.getState(), this.props), mapDispatchToProps(store.dispatch, this.props))));
            };
            class_1.prototype.componentDidMount = function () {
                store.subscribe(this.handleChange);
            };
            return class_1;
        }(React.Component));
    };
};
var Provider = /** @class */ (function (_super) {
    __extends(Provider, _super);
    function Provider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Provider.prototype.componentWillMount = function () {
        window.store = this.props.store;
    };
    Provider.prototype.render = function () {
        return this.props.children;
    };
    return Provider;
}(React.Component));
// APP
// actions
var ADD_TODO = 'ADD_TODO';
// action creators
var addTodo = function (todo) { return ({
    type: ADD_TODO,
    payload: todo
}); };
// reducers
var reducer = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case ADD_TODO:
            state.push(action.payload);
            return state;
        default:
            return state;
    }
};
// components
var ToDoComponent = /** @class */ (function (_super) {
    __extends(ToDoComponent, _super);
    function ToDoComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            todoText: ''
        };
        return _this;
    }
    ToDoComponent.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("label", null, this.props.title || 'Без названия'),
            React.createElement("div", null,
                React.createElement("input", { value: this.state.todoText, placeholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438", onChange: this.updateText }),
                React.createElement("button", { onClick: this.addTodo }, "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C"),
                React.createElement("ul", null, this.props.todos.map(function (todo, idx) { return React.createElement("li", null, todo); })))));
    };
    ToDoComponent.prototype.updateText = function (e) {
        var value = e.target.value;
        this.state.todoText = value;
    };
    ToDoComponent.prototype.addTodo = function () {
        this.props.addTodo(this.state.todoText);
        this.state.todoText = '';
    };
    return ToDoComponent;
}(React.Component));
var ToDo = connect(function (state) { return ({
    todos: state
}); }, function (dispatch) { return ({
    addTodo: function (text) { return dispatch(addTodo(text)); }
}); })(ToDoComponent);
// init
ReactDOM.render(React.createElement(Provider, { store: createStore(reducer, []) },
    React.createElement(ToDo, { title: "\u0421\u043F\u0438\u0441\u043E\u043A \u0437\u0430\u0434\u0430\u0447" })), document.getElementById('app'));