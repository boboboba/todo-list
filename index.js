function createElement(tag, attributes, children) {
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

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    self.state = this.loadState() || {
      input: "",
      todos: [
        { id: 1, text: "Сделать домашку", completed: false, deleteCount: 0},
        { id: 2, text: "Сделать практику", completed: false, deleteCount: 0 },
        { id: 3, text: "Пойти домой", completed: true, deleteCount: 0 },
      ],
    };
    self.update = this.update.bind(this);
    self.render = this.render.bind(this);
    self.loadState = this.loadState.bind(this);
    self.saveState = this.saveState.bind(this);
    self._domNode = this.render();
  }

  saveState(state) {
    localStorage.setItem('todoState', JSON.stringify(state));
  }

  loadState() {
    const stateString = localStorage.getItem('todoState');
    if (stateString === 'undefined'){
      return null;
    }
    return JSON.parse(stateString);
  }

  onAddInputChange(event) {
    self.state.input = event.target.value;
    self.saveState(self.state);
  }

  onDeleteTask(id) {
    const todo = self.state.todos.find(todo => todo.id === id);
    todo.deleteCount++;
    if (todo.deleteCount === 2) {
      const index = self.state.todos.findIndex(todo => todo.id === id);
      self.state.todos.splice(index, 1);
    }
    self.saveState(self.state);
    self.update();
  }

  betterCreateElement(tag, attributes, children, callbacks) {
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

    if (callbacks) {
      Object.keys(callbacks).forEach((key) => {
        element.addEventListener(key, callbacks[key]);
      });
    }

    return element;
  }


  update() {
    self._domNode = self.render();
    document.querySelector(".todo-list").remove();
    document.body.append(self._domNode)
  }

  onCheckTask(id) {
    const todo = self.state.todos.find(todo => todo.id === id);
    todo.completed = !todo.completed;
    self.saveState(self.state);
    self.update();
  }

  onAddTask() {
    const input = document.getElementById("new-todo");
    const text = input.value;

    if (text) {
      self.state.todos.push({ id: self.state.todos.length + 1, text, completed: false });
      input.value = "";
      self.saveState(self.state);
      self.update();
    }
  }

  render() {
    return this.betterCreateElement("div", { class: "todo-list" }, [
      this.betterCreateElement("h1", {}, "TODO List"),
      this.betterCreateElement("div", { class: "add-todo" }, [
        this.betterCreateElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
        }, null, {
          input: this.onAddInputChange,
        }),
        this.betterCreateElement("button", { id: "add-btn" }, "+", {
          click: this.onAddTask,
        }),
      ]),
      this.betterCreateElement("ul", { id: "todos" }, [
        ...self.state.todos.map((todo) => {
          const listItem = this.betterCreateElement("li", { class: todo.completed ? "completed" : "" }, [
            this.betterCreateElement("input", todo.completed ? { type: "checkbox", checked: "" } : { type: "checkbox" }, null, {
              change: () => this.onCheckTask(todo.id),
            }),
            this.betterCreateElement("span", {}, todo.text),
            this.betterCreateElement("button", todo.deleteCount === 1 ? {class: 'deleting'} : {}, "🗑️", { click: () => this.onDeleteTask(todo.id) }),
          ]);

          if (todo.completed) {
            listItem.querySelector("span").classList.add("completed");
          }

          return listItem;
        }),
      ])
    ]);

  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});



class AddTask extends Component {
  constructor(onAddTask) {
    super();
    this.onAddTask = onAddTask;
  }

  render() {
    return this.betterCreateElement("div", { class: "todo-list" }, [
      this.betterCreateElement("h1", {}, "TODO List"),
      new AddTask(this.onAddTask).getDomNode(),
      this.betterCreateElement("ul", { id: "todos" }, [
        ...self.state.todos.map((todo) => new Task(todo, this.onCheckTask, this.onDeleteTask).getDomNode()),
      ])
    ]);
  }
}


class Task extends Component {
  constructor(todo, onCheckTask, onDeleteTask) {
    super();
    this.todo = todo;
    this.onCheckTask = onCheckTask;
    this.onDeleteTask = onDeleteTask;
  }

  render() {
    const listItem = this.betterCreateElement("li", { class: this.todo.completed ? "completed" : "" }, [
      this.betterCreateElement("input", this.todo.completed ? { type: "checkbox", checked: "" } : { type: "checkbox" }, null, {
        change: () => this.onCheckTask(this.todo.id),
      }),
      this.betterCreateElement("span", {}, this.todo.text),
      this.betterCreateElement("button", {}, "🗑", { click: () => this.onDeleteTask(this.todo.id, this.todo.deleteCount) }),
    ]);

    if (this.todo.completed) {
      listItem.querySelector("span").classList.add("completed");
    }

    return listItem;
  }
}