/**
 * [
 *    {
 *      id: <int>
 *      task: <string>
 *      timestamp: <string>
 *      isCompleted: <boolean>
 *    }
 * ]
 */

// variabel berisi array yang akan menampung beberapa object. Object ini berisikan data-data Todo user
const todos = [];
// mendefinisikan Custom Event dengan nama 'render-todo'. Custom event ini digunakan sebagai patokan dasar ketika ada perubahan data pada variabel todos, seperti perpindahan todo (dari incomplete menjadi complete, dan sebaliknya), menambah todo, maupun menghapus todo
const RENDER_EVENT = "render-todo";

// menghasilkan identitas unik pada setiap item todo. Untuk menghasilkan identitas yang unik, kita manfaatkan +new Date() untuk mendapatkan timestamp pada JavaScript
function generateId() {
  return +new Date();
}

// membuat object baru dari data yang sudah disediakan dari inputan (parameter function), diantaranya id, nama todo (task), waktu (timestamp), dan isCompleted (penanda todo apakah sudah selesai atau belum)
function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

function findTodo(todoId) {
  for (todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}

function makeTodo(todoObject) {
  const { id, task, timestamp, isCompleted } = todoObject;

  // membuat elemen Heading level-2
  const textTitle = document.createElement("h2");
  textTitle.innerText = task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = timestamp;

  const textContainer = document.createElement("div");
  // menerapkan style tersebut secara dinamis dengan menggunakan DOM
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });

    container.append(checkButton);
  }

  return container;
}

function addTodo() {
  // menangkap element <input> dengan id title dan memanggil properti value untuk mendapatkan nilai yang diinputkan oleh user
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const generatedID = generateId();
  // membuat sebuah object dari todo dengan memanggil helper generateTodoObject() untuk membuat object baru
  const todoObject = generateTodoObject(
    generatedID,
    textTodo,
    timestamp,
    false
  );
  // object tersebut disimpan pada array todos menggunakan metode push()
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addTaskToCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// fungsi ini akan menghapus Todo berdasarkan index yang didapatkan dari pencarian Todo dengan menggunakan findTodoIndex(). Apabila pencarian berhasil, maka akan menghapus todo tersebut menggunakan fungsi splice() yang disediakan oleh JavaScript
function removeTaskFromCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodoIndex(todoId);
  if (todoTarget === -1) return;
  todos.splice(todoTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Fungsi ini sebenarnya mirip dengan addTaskToCompleted, namun perbedaannya adalah pada state isCompleted yang diubah nilainya ke false, hal ini bertujuan agar todo task yang sebelumnya completed (selesai), bisa dipindah menjadi incomplete (belum selesai)
function undoTaskFromCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// listener akan menjalankan kode dibawahnya ketika event DOMContentLoaded dibangkitkan alias ketika semua elemen HTML sudah dimuat menjadi DOM dengan baik
document.addEventListener("DOMContentLoaded", function () {
  const submitForm /* HTMLFormElement */ = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    // data tersebut akan hilang ketika dimuat ulang
    event.preventDefault();
    addTodo();
  });
});

// membuat listener dari RENDER_EVENT
// tampilan rak “Yang sudah dilakukan” sudah bisa ditampilkan, namun todo masih belum dapat ditampilkan pada rak tersebut. Agar bisa ditampilkan, maka kita perlu memodifikasi kode pada event listener kembali, tujuannya,  ketika todo tersebut sudah masuk dalam status selesai (isCompleted == true) akan ditampilkan pada tampilan web
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById("todos");
  const listCompleted = document.getElementById("completed-todos");

  // clearing list item
  uncompletedTODOList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
});
