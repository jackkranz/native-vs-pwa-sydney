let notes = [];
let offlineNotes = [];
let STORAGE_KEY = "pwa-demo"

const renderNote = n => {
  if (n.title && n.content) {
    const note = document.createElement("div");
    note.className = "note";

    const title = document.createElement("div");
    title.className = "title";
    title.innerHTML = n.title;

    const content = document.createElement("div");
    content.className = "content";
    content.innerHTML = `${n.content}`;

    note.appendChild(title);
    note.appendChild(content);

    document.getElementById("notes-area").appendChild(note);
  }
};
const renderNotes = () => {
  document.getElementById("notes-area").innerHTML = "";
  notes.map(n => renderNote(n));
  if(offlineNotes.length > 0){
    const offline = document.createElement("h3");
    offline.innerHTML = "Offline Notes";
    document.getElementById("notes-area").appendChild(offline);
    offlineNotes.map(n => renderNote(n));
  }
}

const loadNotes = () => {
  fetch("/notes")
    .then(response => response.json())
    .then(json => {
      notes = json;
      renderNotes();
    });
};

const addNote = (newNote) => {
  fetch("/notes", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newNote)
  }).then(response => {
    if(response.ok){
      console.log(response)
      notes.push({title: `Note #${notes.length}`,content:'This is a new note'});
    renderNotes();
    }
  }).catch(e => {
    console.log('Catch');
  })
}

document.getElementById("load-notes").addEventListener("click", () => {
  loadNotes();
});

document.getElementById("add-note").addEventListener("click", () => {
  addNote({title: `Note #${notes.length + offlineNotes.length}`,content:'This is a new note'});
});

const register = () => {
  navigator.serviceWorker.register("./sw.js").then(
    registration => {
      console.log("sw sucessfully registered: ", registration.scope);
    },
    error => {
      console.log("ServiceWorker registration failed: ", error);
    }
  );
};

if ("serviceWorker" in navigator) {
  self.addEventListener("load", () => register());
}

const addNoteOffline = (note) => {
  offlineNotes.push(note);
    renderNotes();
}

navigator.serviceWorker.addEventListener('message', event => {
  const note = event.data.body;
  console.log(` POST to ${event.data.url} failed with body: ${JSON.stringify(note)}`);
  addNoteOffline(note);
});

window.addEventListener('online',  () => {
  if(offlineNotes.length > 0){
    offlineNotes.map(n => {
      addNote(n);
    });
    loadNotes();
    offlineNotes = [];
  }
});