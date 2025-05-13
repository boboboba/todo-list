function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (callbacks) {
    for (const [action, func] of Object.entries(callbacks)) {
      element[action] = func;
    }
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
    this.state = [
      'Сделать домашку',
      'Сделать практику',
      'Пойти домой'
    ];
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newNode = this.render();
    this._domNode.replaceWith(newNode);
    this._domNode = newNode;
  }
}

class AddTask extends Component {

  constructor(onAddTask) {
    super();
    this.onAddTask = onAddTask;
    this.inputValue = '';
  }

  render() {
    return createElement("div", {class: "add-todo"}, [
      createElement("input", {
        type: "text",
        placeholder: "Задание"
      }, {}, {
        oninput: (e) => {
          this.inputValue = e.target.value;
        }
      }),
      createElement("button", {}, "+", {
        onclick: () => {
          this.onAddTask(this.inputValue);
          this.inputValue = '';
        }
      })
    ]);
  }

}

class Task extends Component {
  constructor(task, onToggle, onDelete) {
    super();
    this.task = task;
    this.onToggle = onToggle;
    this.onDelete = onDelete;
    this.completed = false;

    this.status = false;
  }

  render() {
    const labelStyle = this.completed ? "gray" : "black";

    return createElement("li", {}, [
      createElement("input", {type: "checkbox"}, null, {
        onchange: () => {
          this.completed = !this.completed;
          this.onToggle(this.task);
          super.update();
        }
      }),
      createElement("label", {style: `color: ${labelStyle}`}, this.task),
      createElement("button", {}, "🗑️", {
        onclick: (e) => {
          if (this.status) {
            this.onDelete(this.task)
          } else {
            e.target.style.backgroundColor = 'red';
            this.status = true;
          }
        }
      })
    ]);
  }
}


class TodoList extends Component {
  constructor() {
    super();
  }

  onAddTask = (task) => {
    this.state.push(task);
    this.update();
  };

  onDeleteTask = (task) => {
    this.state = this.state.filter(t => t !== task);
    this.update();
  };

  onChangeElement(element) {

  }

  render() {
    const taskElements = this.state.map(task =>
        new Task(task, this.onChangeElement, this.onDeleteTask).getDomNode()
    );

    const addTaskComponent = new AddTask(this.onAddTask).getDomNode();

    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      addTaskComponent,
      createElement("ul", { id: "todos" }, taskElements)
    ]);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});