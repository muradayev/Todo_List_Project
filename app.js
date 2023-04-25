const form = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo")
const todoList = document.querySelector(".list-group")
const firstCardBody = document.querySelectorAll(".card-body")[0]
const secondCardBody = document.querySelectorAll(".card-body")[1]
const filter = document.querySelector("#filter")
const clearBtn = document.querySelector("#clear-todos")

eventListeners()

// All event listeners
function eventListeners() {
    form.addEventListener("submit", addTodo)
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI)
    secondCardBody.addEventListener("click", deleteTodo)
    filter.addEventListener("keyup", filterTodos)
    clearBtn.addEventListener("click", clearAllTodos)
}

function clearAllTodos() {
    if (confirm("Do you want to delete all todos?")) {
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild)
        }
        localStorage.removeItem("todos")
    }
}

function filterTodos(e) {
    const filteredValue = e.target.value.toLowerCase()
    const listItems = document.querySelectorAll(".list-group-item")

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase()
        if (text.indexOf(filteredValue) === -1) {
            listItem.setAttribute("style", "display : none !important")
        } else {
            listItem.setAttribute("style", "display : block")
        }
    })

}

function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove()
        deleteTodoFromLocalStorage(e.target.parentElement.parentElement.textContent)
        showAlert("success", "Todo deleted succesfully")
    }
}

function deleteTodoFromLocalStorage(deletedTodoFromUI) {
    let todos = getTodosFromLocalStorage()
    todos.forEach(function (todo, index) {
        if (todo === deletedTodoFromUI) {
            todos.splice(index, 1)
        }
    })

    localStorage.setItem("todos", JSON.stringify(todos))
}

function loadAllTodosToUI() {
    let todos = getTodosFromLocalStorage()

    todos.forEach(function (todo) {
        addTodoToUI(todo)
    })
}

function addTodo(e) {
    const newTodo = todoInput.value.trim();

    if (newTodo === "") {
        showAlert("danger", "Please enter new todo")
    } else {
        addTodoToUI(newTodo)
        addTodoToLocalStorage(newTodo)
        showAlert("success", "Todo was added succesfully")
    }

    e.preventDefault();
}

function getTodosFromLocalStorage() {
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem("todos"))
    }

    return todos
}

function addTodoToLocalStorage(newTodo) {
    let todos = getTodosFromLocalStorage();

    todos.push(newTodo)

    localStorage.setItem("todos", JSON.stringify(todos))
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`
    alert.textContent = message

    firstCardBody.appendChild(alert)

    setTimeout(() => {
        alert.remove()
    }, 1000);
}

function addTodoToUI(newTodo) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>"

    listItem.className = "list-group-item d-flex justify-content-between"
    listItem.appendChild(document.createTextNode(newTodo))
    listItem.appendChild(link)

    todoList.appendChild(listItem)
    todoInput.value = ""
}