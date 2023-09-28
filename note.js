//Global Query Selectors

const noteContainer = document.querySelector(".note-container");
const modalContainer=document.querySelector(".modal-container");
const form=document.querySelector("form");

//Class for creating new note 
class Note{
    constructor(title,body){
        this.title=title
        this.body=body
        this.id=Math.random();
    }
}

///Local Storage///

// Function - Retrieves notes from local storage

function getNotes(){
    let notes;
    if(localStorage.getItem("noteApp.notes")===null){
        notes=[];
    }else{
        notes=JSON.parse(localStorage.getItem("noteApp.notes"));
    }
    return notes;
}

//Function - Add note to local storage 


function addNote(note)
{
    const notes=getNotes();
    notes.push(note);
    localStorage.setItem('noteApp.notes',JSON.stringify(notes))
}
//Function - to remove note from local storage

function removeNote(id){
    const notes=getNotes();
    notes.forEach((note,index)=>{
        if(note.id===id){
             notes.splice(index,1);
        }
        localStorage.setItem("noteApp.notes",JSON.stringify(notes))
    })
}


///Ui updates///
//Function - Create new note in UI 

function addNoteToList(note){
    const newUiNote=document.createElement("div")
    newUiNote.classList.add("note");
    newUiNote.innerHTML=`
    <span hidden>${note.id}</span>
    <h2 class="note__title">${note.title}</h2>
    <p class="note__body">${note.body}</p>
    <div class="note__btns" >
    <button class="note__btn note__view">View Details</button>
    <button class="note__btn note__delete">Delete</button>
    </div>
    `
    noteContainer.append(newUiNote)
}

//Function - Show notes in UI 
function displayNotes(){
    const notes=getNotes(); 
    notes.forEach(note => {
        addNoteToList(note);
    });
}

//Function - Show alert message 

function showAlert(message,alertCls){
    const alertDiv=document.createElement("div");
    alertDiv.className=`message ${alertCls}`;
    alertDiv.appendChild(document.createTextNode(message))
    form.insertAdjacentElement("beforebegin",alertDiv);
    const titleInput=document.querySelector("#title");
    titleInput.focus();
    setTimeout(()=>alertDiv.remove(),2000)
}

//Function - View note in modal 

function activateNoteModal(title,body){
    const modalTitle=document.querySelector(".modal__title")
    const modalBody=document.querySelector(".modal__body")
    modalTitle.textContent=title;
    modalBody.textContent=body;
    modalContainer.classList.add("active");
}

//Event - close modal 

const modalBtn =document.querySelector(".modal__btn").addEventListener("click",()=>{
    modalContainer.classList.remove("active");
})

// Event - Note buttons 

noteContainer.addEventListener("click",(e)=>{
    // console.log(e.target);
    if(e.target.classList.contains("note__view")){
        const currentNote=e.target.closest(".note");
        const currentTitle=currentNote.querySelector(".note__title").textContent;
        const currentBody=currentNote.querySelector(".note__body").textContent;
        activateNoteModal(currentTitle,currentBody);
    }

    if(e.target.classList.contains("note__delete")){
        const currentNote=e.target.closest(".note");
        noteContainer.remove(currentNote)
        showAlert("Note permanently deleted","remove-message")
        const id=currentNote.querySelector("span").textContent;
        removeNote(Number(id));
    }
})

// Event - Display Notes 

document.addEventListener("DOMContentLoaded",displayNotes);

// Event - Note form Submit 

form.addEventListener("submit",(e)=>{
    e.preventDefault();  //Prevents reloading

    const titleInput=document.querySelector("#title");
    const noteInput=document.querySelector("#note");

    //validate inputs 
    if(titleInput.value.length>0 && noteInput.value.length>0){
        const newNote=new Note(titleInput.value,noteInput.value);
        addNoteToList(newNote);
        addNote(newNote); 
        titleInput.value="";
        noteInput.value="";
        titleInput.focus();
        showAlert("Added Note Succesfully","success-message")
    }else{
        showAlert("Please add a title and a note","alert-message")
    }
}) 