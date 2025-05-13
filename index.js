function createElement(tag, attributes, children, ...callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  callbacks.forEach(callback => {
    const [eventName, eventCallback] = callback;
    element.addEventListener(eventName, eventCallback.bind(this));
  });

  return element;
}

class Component {
  constructor() {
    this._domNode = null;
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newDomNode = this.render();
    this._domNode.parentNode.replaceChild(newDomNode, this._domNode);
    this._domNode = newDomNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [
        { id: 1, text: "Сделать домашку", completed: false },
        { id: 2, text: "Сделать практику", completed: false },
        { id: 3, text: "Пойти домой", completed: false }
      ],
      inputState: ""
    };
  }

  onAddTask() {
    debugger;
    this.state.tasks.push({
      id: this.state.tasks.length + 1,
      text: this.state.inputState,
      completed: false
    });
    this.update();
  }

  onAddInputChange() {
    this.state.inputState = document.getElementById('new-todo').value;
  }

  toggleTask(index) {
    this.state.tasks[index].completed = !this.state.tasks[index].completed;
    this.update();
  }

  render() {
    return createElement("div", {class: "todo-list"}, [
      createElement("h1", {}, "TODO List"),
      createElement("div", {class: "add-todo"}, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
        }, {}, ['input', this.onAddInputChange.bind(this)]),
        createElement("button", {id: "add-btn"}, "+", ['click', this.onAddTask.bind(this)])
      ]),
      createElement("ul", {id: "todos"}, this.state.tasks.map((task, index) => {
            const attr = {
              type: "checkbox",
            }
            if (task.completed)
              attr.checked = '';
            return createElement("li", {key: task.id}, [
              createElement("input", attr, {}, ['change', () => this.toggleTask(index)]),
              createElement("label", { style: task.completed ? 'color: gray' : '' }, task.text),
              createElement("button", {}, "🗑", ['click', () => {
                const index = this.state.tasks.findIndex(t => t.id === task.id);
                this.state.tasks.splice(index, 1);
                this.update();
              }])
            ])
          }
      ))
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});