const todoTable = document.getElementById("todoTable")
const tableTitle = document.getElementById("tableTitle")
const editDiv = document.getElementById("editDiv")

const getIncompleteTodos = async () => {
    let counter = 1
    let data = await fetch ('http://localhost:3000?complete=false')
    let incompleteTodos = await data.json()
    todoTable.innerHTML = ''
    tableTitle.textContent = 'Incomplete Todos'

    incompleteTodos.data.forEach( (todo) => {
        todoTable.innerHTML +=
            '<tr>'
                + '<td>'
                    + todo.todo
                + '</td>'
                + '<td>'
                    + "<p id='tag" + counter + "'></p>"
                + '</td>'
                + '<td>'
                    + "<button class='markComplete' data-id='" + todo._id + "'>Mark Complete</button>"
                + '</td>'
                + '<td>'
                    + "<button class='editTodo' data-id='" + todo._id + "' data-todo='" +  todo.todo + "'>Edit</button>"
                + '</td>'
                + '<td>'
                    + "<button class='deleteTodo' data-id='" + todo._id + "'>Delete</button>"
                + '</td>'
                + '<td>'
                    + "<button data-tag='tag" + counter + " data-id='" + todo._id + "'>Add Tag</button>"
                + '</td>'
            +'</tr>'
    })

    updateStatusEventListener(true)
    deleteEventListener()
    editEventListener()
    counter ++
}

const getCompleteTodos = async () => {
    let data = await fetch ('http://localhost:3000?complete=true')
    let completeTodos = await data.json()
    todoTable.innerHTML = ''
    tableTitle.textContent = 'Complete Todos'

    completeTodos.data.forEach( (todo) => {
        todoTable.innerHTML +=
            '<tr><td>' + todo.todo + '</td>'
            + '<td>'
            + "<button class='markComplete' data-id='" + todo._id + "'>Mark Incomplete</button>"
            + '</td>'
            + '<td>'
            + "<button class='editTodo' data-id='" + todo._id + "' data-todo='" +  todo.todo + "'>Edit</button>"
            + '</td>'
            + '<td>'
            + "<button class='deleteTodo' data-id='" + todo._id + "'>Delete</button>"
            + '</td>'
            +'</tr>'
    })

    updateStatusEventListener(false)
    deleteEventListener()
    editEventListener()
}

const markTodoComplete = async (id, status) => {

    const updateStatus = {
        "complete": status
    }

    let data = await fetch ('http://localhost:3000/update-status/'+ id, {
        method: 'PUT',
        body: JSON.stringify(updateStatus),
        headers: {"Content-Type": "application/json"}
    })

    updateDisplayedTodos()
    return await data.json()
}

const deleteTodo = async (id) => {
    let data = await fetch ('http://localhost:3000/delete-todo/'+ id, {
        method: 'PUT'
    })

    updateDisplayedTodos()
    return await data.json()
}

const addTodo = async (todoString) => {

    const toDoToAdd = {
        "todo": todoString
    }

    let data = await fetch ('http://localhost:3000/', {
        method: 'POST',
        body: JSON.stringify(toDoToAdd),
        headers: {"Content-Type": "application/json"}
    })

    getIncompleteTodos()
    return await data.json()
}

const editTodo = async (id, todoString) => {
    const toDoToEdit = {
        "todo": todoString
    }

    let data = await fetch ('http://localhost:3000/' + id, {
        method: 'PUT',
        body: JSON.stringify(toDoToEdit),
        headers: {"Content-Type": "application/json"}
    })

    updateDisplayedTodos()
    return await data.json()
}

const editEventListener = () => {
    document.querySelectorAll('.editTodo').forEach((button) => {
        button.addEventListener('click', (e) => {
            editDiv.innerHTML =
                '<input class="editInput" type="text" placeholder="' + e.target.dataset.todo + '" />'
                + "<button class='editTodoGo' data-id='" + e.target.dataset.id + "'>Go</button>"

            document.querySelector('.editTodoGo').addEventListener('click', (e) => {
                const todoString = document.querySelector('.editInput').value
                editTodo(e.target.dataset.id, todoString)
                editDiv.innerHTML = ''
            })
        })
    })
}

const deleteEventListener = () => {
    document.querySelectorAll('.deleteTodo').forEach((button) => {
        button.addEventListener('click', (e) => {
            deleteTodo(e.target.dataset.id)
        })
    })
}

const updateStatusEventListener = (status) => {
    document.querySelectorAll('.markComplete').forEach((button) => {
        button.addEventListener('click', (e) => {
            markTodoComplete(e.target.dataset.id, status)
        })
    })
}

const addTagEventListener = () => {
    document.querySelectorAll('.addTag').forEach((button) => {
        button.addEventListener('click', (e) => {
            editDiv.innerHTML =
                '<input class="tagInput" type="text" placeholder="eg. home" />'
                + "<button class='addTagGo' data-id='" + e.target.dataset.id + "'>Go</button>"

            document.querySelector('.addTagGo').addEventListener('click', (e) => {
                const tagToAdd = document.querySelector('.tagInput').value
                addTag(e.target.dataset.id, tagToAdd)
                editDiv.innerHTML = ''
                document.getElementById(e.target.dataset.button)
            })
        })
    })
}

const updateDisplayedTodos = () => {
    if (tableTitle.textContent == "Incomplete Todos") {
        getIncompleteTodos()
    } else if (tableTitle.textContent == "Complete Todos") {
        getCompleteTodos()
    }
}

document.getElementById('incompleteTodos').addEventListener('click', () => {
    getIncompleteTodos()
})

document.getElementById('completeTodos').addEventListener('click', () => {
    getCompleteTodos()
})

document.getElementById('addTodo').addEventListener('click', () => {
    const todoString = document.getElementById('todoText').value
    document.getElementById('todoText').value = ''
    addTodo(todoString)
})
