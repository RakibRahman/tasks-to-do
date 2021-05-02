const app = document.getElementById("app");

app.innerHTML = `  
                    <div id="taskList">
                    <div class="header">
                    <h2 class="title">Tasks To Do</h2>
                 <div id="infoArea">
                        <p>
                        <span class="count"></span>
                        tasks to complete
                        </p>
                        <button id="clear">Clear Completed ⭕</button>
                 </div>
                 </div>
                 <form class="taskList-form" name="taskList">
                 
                 <input type="text" name="task" placeholder="add a task">
                 
                 </form>

                 <ul class="taskCollection"></ul>
                    </div>

                    `;

const form = document.forms.taskList;
const inputTask = form.elements.task;
const count = document.querySelector(".count");
const clear = document.querySelector("#clear");
const taskCollection = document.querySelector(".taskCollection");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTask(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function provideTask(todos) {
  let taskItems = "";
  todos.forEach((todo, index) => {
    taskItems += `
    
        <li data-id="${index}"${todo.complete ? ' class="task-complete"' : ""}>
        <input type="checkbox"${todo.complete ? " checked" : ""} />
        <span>${todo.label}</span>
        <button>[x]</button>
        </li>
    `;
  });
  taskCollection.innerHTML = taskItems;
  count.innerText = todos.filter((todo) => !todo.complete).length;
  clear.style.display = todos.filter((todo) => todo.complete).length
    ? "block"
    : "none";
}
function addTask(e) {
  e.preventDefault();

  const label = inputTask.value.trim();
  if (!label) return false;
  const complete = false;
  todos = [...todos, { label, complete }];
  provideTask(todos);
  saveTask(todos);
  inputTask.value = "";
}
function updateTask(e) {
  const id = parseInt(e.target.parentNode.getAttribute("data-id"), 10);
  const complete = e.target.checked;

  todos = todos.map((todo, index) => {
    if (index === id) {
      return {
        ...todo,
        complete,
      };
    }
    return todo;
  });
  provideTask(todos);
  saveTask(todos);
}
function editTask(e) {
  if (e.target.tagName !== "SPAN") {
    return;
  }
  const id = parseInt(e.target.parentNode.getAttribute("data-id"), 10);

  const taskLabel = todos[id].label;
  console.log(taskLabel);
  const input = document.createElement("input");
  console.log(input);
  input.type = "text";
  input.value = taskLabel;

  function handleEdit(e) {
    e.stopPropagation();
    const label = this.value;
    if (label !== taskLabel) {
      todos = todos.map((todo, index) => {
        if (index === id) {
          return {
            ...todo,
            label,
          };
        }
        return todo;
      });
      provideTask(todos);
      saveTask(todos);
    }

    e.target.style.display = "";
    this.removeEventListener("change", handleEdit);
    this.remove();
  }

  e.target.style.display = "none";
  e.target.parentNode.append(input);
  input.addEventListener("change", handleEdit);
  input.focus();
}
function deleteTask(e) {
  if (e.target.tagName !== "BUTTON") {
    return;
  }

  const id = parseInt(e.target.parentNode.getAttribute("data-id"), 10);

  const label = e.target.previousElementSibling.innerText;

  Swal.fire({
    icon: "question",
    iconColor: "green",
    title: `Do you want to delete  <span class="delete">${label}</span> `,
    showCancelButton: true,
    confirmButtonText: `Yes`,
    customClass: {
      cancelButton: "order-1 right-gap",
      confirmButton: "order-2",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      todos = todos.filter((todo, index) => index !== id);

      provideTask(todos);
      saveTask(todos);
      Swal.fire("Deleted!", "", "error");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}
function clearTask() {
  const count = todos.filter((todo) => todo.complete).length;
  if (count === 0) {
    return;
  }

  Swal.fire({
    icon: "question",
    iconColor: "green",
    title: `Do you want to delete  <span class="delete">${count}</span> tasks?`,
    showCancelButton: true,
    confirmButtonText: `Yes`,
    customClass: {
      cancelButton: "order-1 right-gap",
      confirmButton: "order-2",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      todos = todos.filter((todo) => !todo.complete);
      provideTask(todos);
      saveTask(todos);
      Swal.fire("Deleted!", "", "error");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}

function init() {
  provideTask(todos);
  form.addEventListener("submit", addTask);
  taskCollection.addEventListener("change", updateTask);
  taskCollection.addEventListener("dblclick", editTask);
  taskCollection.addEventListener("click", deleteTask);
  clear.addEventListener("click", clearTask);
}
init();
