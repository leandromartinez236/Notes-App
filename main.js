const body = document.querySelector('body')
const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector(".title input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button")
// Notes Container
const containerNotes = document.querySelector(".notes-container")
// Trash
const openTrash = document.querySelector(".open-trash"),
  trashBox = document.querySelector(".trash"),
  trashGrid = document.querySelector(".trash-grid")

// LocalStorage
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
let notes = JSON.parse(localStorage.getItem("notes") || "[]")
let trash = JSON.parse(localStorage.getItem("trash") || "[]")
let isUpdate = false, updateId

// Count Notes
const countValue = document.querySelector('.count-value')

// Modal Trash
const btnEmptyTrash = document.querySelector(".btn-empty-trash")
const openModal = document.querySelector('.open-modal');
const modalTrash = document.querySelector('.modal-trash');
const closeModal = document.querySelector('.close-modal');

// Dark Mode
const btnDarkMode = document.querySelector(".btn-dark-mode")
btnDarkMode.addEventListener('click', () => {
  body.classList.toggle('dark-mode')
  if (body.classList.contains('dark-mode')) {
    btnDarkMode.checked = true
    localStorage.setItem('dark-mode', 'true')
  } else {
    btnDarkMode.checked = false
    localStorage.setItem('dark-mode', 'false')
  }
})
if (localStorage.getItem('dark-mode') === 'true') {
  btnDarkMode.checked = true
  body.classList.add('dark-mode')
} else {
  btnDarkMode.checked = false
  body.classList.remove('dark-mode')
}


// 
openTrash.addEventListener('click', () => {
  trashBox.classList.toggle("active")
  if (containerNotes.classList.value.includes("hidden")) {
    containerNotes.classList.remove("hidden")
  } else {
    containerNotes.classList.add("hidden")
  }
  showTrash()
})
addBox.addEventListener('click', () => {
  titleTag.focus()
  popupBox.classList.add("show")
})
closeIcon.addEventListener('click', () => {
  isUpdate = false
  titleTag.value = ""
  descTag.value = ""
  addBtn.innerText = "Add Note"
  popupTitle.innerText = "Add a new Note"
  popupBox.classList.remove("show")
})

// Init App
const showTrash = () => {
  document.querySelector('.msg-trash').classList.remove('empty')
  if (!trash.length > 0) {
    document.querySelector('.msg-trash').classList.add('empty')
  }

  document.querySelectorAll(".trash-grid .note").forEach(note => note.remove())
  trash?.forEach((note, index) => {
    let noteTrash = document.createElement("li")
    noteTrash.classList.add('note')
    noteTrash.innerHTML = `
        <div class="details">
          <h3>${note.title}</h3>
          <p>
           ${note.description}.
          </p>
        </div>
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
            <ul class="menu">
              <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
              <li onclick="restoreNote(${index})"><i class="uil uil-history-alt"></i>Restore</li>
            </ul>
          </div>
        </div>
    `
    noteTrash.style.opacity = 0.8
    trashGrid.append(noteTrash)
  })
}
const showNotes = () => {
  countValue.innerText = notes?.length
  document.querySelectorAll(".note").forEach(note => note.remove())
  notes.forEach((note, index) => {
    let liTag = `
      <li class="note">
        <div class="details">
          <h3>${note.title}</h3>
          <p>
           ${note.description}.
          </p>
        </div>
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
            <ul class="menu">
              <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
              <li onclick="moveToTrash(${index})"><i class="uil uil-trash"></i>Delete</li>
            </ul>
          </div>
        </div>
      </li>
    `
    addBox.insertAdjacentHTML("afterend", liTag)
  })
}

// Modal Trash
openModal.addEventListener('click', () => {
  modalTrash.classList.add('modal-trash-show')
})
closeModal.addEventListener('click', () => {
  modalTrash.classList.remove('modal-trash-show')
})
btnEmptyTrash.addEventListener('click', () => {
  localStorage.removeItem("trash")
  trash = JSON.parse(localStorage.getItem("trash") || "[]")
  showTrash()
  modalTrash.classList.remove('modal-trash-show')
})


// Function Options Notes
function showMenu(elem) {
  elem.parentElement.classList.add("show")
  // removing show class from the settings menu on document click
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != elem) {
      // console.log(elem.parentElement);
      elem.parentElement.classList.remove("show")
    }
  })
}
function moveToTrash(noteId) {
  let deletedNote = notes[noteId]
  trash.unshift(deletedNote)
  notes.splice(noteId, 1)
  // saving updates notes to localStorage
  localStorage.setItem("notes", JSON.stringify(notes))
  localStorage.setItem("trash", JSON.stringify(trash))
  showNotes()
  showTrash()
}
function deleteNote(noteId) {
  trash.splice(noteId, 1)
  // saving updates notes to localStorage
  localStorage.setItem("trash", JSON.stringify(trash))
  showTrash()
}
function updateNote(noteId, title, desc) {
  isUpdate = true
  updateId = noteId
  addBox.click()
  titleTag.value = title
  descTag.value = desc
  addBtn.innerText = "Update Note"
  popupTitle.innerText = "Update a Note"
}
function restoreNote(noteId) {
  let note = trash[noteId]
  trash.splice(noteId, 1)
  notes.push(note)
  localStorage.setItem("notes", JSON.stringify(notes))
  localStorage.setItem("trash", JSON.stringify(trash))
  showNotes()
  showTrash()
}

// Add Note
addBtn.addEventListener('click', (e) => {
  e.preventDefault()
  let noteTitle = titleTag.value,
    noteDes = descTag.value.replaceAll(("\n"), ' ')
  if (noteTitle || noteDes) {
    let dateObj = new Date(),
      month = months[dateObj.getMonth()],
      day = dateObj.getDate(),
      year = dateObj.getFullYear()

    let noteInfo = {
      title: noteTitle ? noteTitle : "Sin titulo",
      description: noteDes,
      date: `${month} ${day}, ${year}`,
    }
    if (!isUpdate) {
      notes.push(noteInfo) // adding new note to notes
    } else {
      isUpdate = false
      notes[updateId] = noteInfo // updating specified note
    }
    // sabing notes to localStorage
    localStorage.setItem("notes", JSON.stringify(notes))
    closeIcon.click()
    showNotes()
  }
})

// Init App
const initApp = () => {
  showNotes(),
    showTrash()
}
initApp()