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
                        <button>Clear Completed ⭕</button>
                 </div>
                 <form class="taskList-form" name="taskList">
                 
                 <input type="text" name="task" placeholder="add a task">
                 
                 </form>

                 <ul class="taskCollection"></ul>
                    </div>

                    `;

const form = document.forms.taskList;
const inputTask = form.elements.task;

const taskCollection = document.querySelector(".taskCollection");

let todos = [];

function provideTask(todos) {
  let taskItems = "";
  todos.forEach((item, index) => {
    taskItems += `
    
        <li data-id="${index}">
        <input type="checkbox" />
        <span>${item.label}</span>
        <button>💢</button>
        </li>
    `;
  });
  taskCollection.innerHTML = taskItems;
}

function addTask(e) {
  e.preventDefault();
  const label = inputTask.value.trim();
  const complete = false;
  todos = [...todos, { label, complete }];
  inputTask.value = "";
  provideTask(todos);
  console.log(todos);
}

function init() {
  form.addEventListener("submit", addTask);
}
init();
