const cl = console.log;

const todoform = document.getElementById('todoform')
const todoInput = document.getElementById('todoInput')
const addTodoBtn = document.getElementById('addTodoBtn')
const updateTodoBtn = document.getElementById('updateTodoBtn')
const todoConatiner = document.getElementById('todoConatiner')

const BASE_URL = `https://shubham-92216-default-rtdb.asia-southeast1.firebasedatabase.app/`;
const TODO_URL = `${BASE_URL}/todo.json`;

const state = {
    todoArr: [],
    EDIT_ID: null,
}

function showspinner() {
    spinner.classList.remove('d-none')
}
function hidespinner() {
    spinner.classList.add('d-none')
}
function toggelspiner() {
    spinner.classList.toggle('d-none')
}


function readtodo(arr) {
    let result = ``;
    arr.forEach(ele => {
        result += ` <li class="list-group-item d-flex justify-content-between align-items-center" id="${ele.id}">
                                <strong>
                                    <h1>${ele.todoInput}</h1>
                                </strong>
                            <div>
                                <i onclick="editTodo(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                                <i onclick="deleteTodo(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                            </div>
                            </li>`;
    });
    todoConatiner.innerHTML = result;
}

function fetchtodo() {
    fetch(TODO_URL, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error..?')
            }
            return res.json()
        })
        .then(data => {
            for (const key in data) {
                data[key].id = key;
                state.todoArr.unshift(data[key]);
            }
            readtodo(state.todoArr)
        })
}
fetchtodo()

//create-todo//
function onaddtodo(eve) {

    eve.preventDefault()
    let todoObj = {
        todoInput: todoInput.value,
    }
    showspinner()
    fetch(TODO_URL, {
        method: "POST",
        body: JSON.stringify(todoObj),
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error..?')
            }
            return res.json()
        })
        .then(data => {
            todoObj.id = data.name;
            let li = document.createElement('li')
            li.className = `list-group-item d-flex justify-content-between align-items-center`;
            li.id = todoObj.id;
            li.innerHTML = `<strong>
                                    <h1>${todoObj.todoInput}</h1>
                                </strong>
                            <div>
                                <i onclick="editTodo(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                                <i onclick="deleteTodo(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                            </div>`;
            todoConatiner.prepend(li)
            todoform.reset()
            Swal.fire({
                title: "Todo Created Successfully..!!",
                text: "Your todo added has been successfully..!!",
                icon: "success",
                timer:2000
            });
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}

// edittodo//
function editTodo(ele) {
    let edit_id = ele.closest('li').id;
    showspinner()
    state.EDIT_ID = edit_id;
    let edit_url = `${BASE_URL}/todo/${edit_id}.json`;

    fetch(edit_url, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error..?')
            }
            return res.json()
        })
        .then(data => {
            todoInput.value = data.todoInput,
                addTodoBtn.classList.add('d-none');
            updateTodoBtn.classList.remove('d-none');
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })

}

//delete-todo//
function deleteTodo(ele) {
    let delete_id = ele.closest('li').id;
    showspinner()
    //cl(delete_id)
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let delete_url = `${BASE_URL}/todo/${delete_id}.json`;
            fetch(delete_url, {
                method: "DELETE",
                body: null,
                headers: {
                    "content-type": "application/json",
                    "Authorization": "TOKEN JWT FROM LS",
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Errorr..?')
                    }
                    return res.json()
                })
                .then(data => {
                    let getIndex = state.todoArr.findIndex(p => p.id === delete_id)
                    state.todoArr.splice(getIndex, 1)
                    ele.closest('li').remove()

                    Swal.fire({
                        title: "Todo Deleted Successfully..!",
                        text: "Your file has been deleted successfully",
                        icon: "success",
                        timer: 3000
                    });
                })
                .catch(err => {
                    cl(err)
                })
                .finally(() => {
                    hidespinner()
                })
        } else {
            hidespinner()
        }
    });
}

//update-todo//
function onupdatetodo() {
    let update_id = state.EDIT_ID;
    let update_url = `${BASE_URL}/todo/${update_id}.json`;

    let update_obj = {
        todoInput: todoInput.value,
        id: update_id,
    }
    showspinner()
    fetch(update_url, {
        method: "PATCH",
        body: JSON.stringify(update_obj),
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN FROM JWT LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('ERROR..?')
            }
            return res.json()
        })
        .then(data => {
            li = document.getElementById(update_id)
            li.innerHTML = `<strong>
                        <h2>${update_obj.todoInput}</h2>
                    </strong>
                    <div>
                        <i onclick="editTodo(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                        <i onclick="deleteTodo(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                    </div>`;
            addTodoBtn.classList.remove('d-none');
            updateTodoBtn.classList.add('d-none');
            Swal.fire({
                title: "TODO UPDATED SUCCESSFULLY..!",
                text: "yours todo has been updated successfully..!!",
                icon: "success",
                timer: 3000
            });
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}

todoform.addEventListener('submit', onaddtodo)
updateTodoBtn.addEventListener('click', onupdatetodo)