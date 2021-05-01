const app = document.getElementById("app");

app.innerHTML = `  
                    <div class="taskList">
                    <div class="header"></div>
                    <h2 class="title">Tasks List</h2>
                 <div>
                        <p>
                        <span class="count"></span>
                        tasks to complete
                        </p>
                        <button id="clear">Clear Completed ⭕</button>
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

  console.log("edit");
}
function deleteTask(e) {
  if (e.target.tagName !== "BUTTON") {
    return;
  }

  const id = parseInt(e.target.parentNode.getAttribute("data-id"), 10);
  const label = e.target.previousElementSibling.innerText;
  console.log(label);
  if (window.confirm(`Are you sure you want to delete ${label}?`)) {
    todos = todos.filter((todo, index) => index !== id);
    provideTask(todos);
    saveTask(todos);
  }
}
function clearTask() {
  const count = todos.filter((todo) => todo.complete).length;
  if (count === 0) {
    return;
  }
  if (window.confirm(`Are you sure you want to delete ${count} tasks?`)) {
    todos = todos.filter((todo) => !todo.complete);
    provideTask(todos);
    saveTask(todos);
  }
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
