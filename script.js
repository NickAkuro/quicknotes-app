
// Select HTML elements
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

// Load saved notes from localStorage
let notes = [];

try {
    const savedNotes = localStorage.getItem("quickNotes");

    if (savedNotes !== null) {
        const parsedNotes = JSON.parse(savedNotes);

        if (Array.isArray(parsedNotes)) {
            notes = parsedNotes;
        }
    }
} catch (error) {
    console.error("Could not load saved notes:", error);
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem("quickNotes", JSON.stringify(notes));
}

// Update note count
function updateNoteCount() {

    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } 
    else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } 
    else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }

}

// Render notes
function render() {

    // Clear existing list
    notesList.textContent = "";

    // Get search text
    const searchText = searchInput.value.trim().toLowerCase();

    // Filter notes based on search
    const filteredNotes = notes.filter(function(note) {
        return note.text.toLowerCase().includes(searchText);
    });

    // Show message if search finds nothing
    if (filteredNotes.length === 0 && searchText !== "") {

        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);

    }

    // Display matching notes
    filteredNotes.forEach(function(note) {

        // Create note card
        const li = document.createElement("li");

        li.classList.add(
            `category-${note.category.toLowerCase()}`
        );

        // Create note text
        const noteText = document.createElement("p");
        noteText.textContent = note.text;

        // Create category label
        const categoryLabel = document.createElement("span");
        categoryLabel.textContent = note.category;
        categoryLabel.classList.add("category-label");

        // Create date
        const date = document.createElement("small");
        date.textContent = note.createdAt;

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        // Delete selected note
        deleteButton.addEventListener("click", function() {

            notes = notes.filter(function(item) {
                return item.id !== note.id;
            });

            saveNotes();
            render();

        });

        // Add elements to note card
        li.appendChild(noteText);
        li.appendChild(categoryLabel);
        li.appendChild(document.createElement("br"));
        li.appendChild(date);
        li.appendChild(document.createElement("br"));
        li.appendChild(deleteButton);

        notesList.appendChild(li);

    });

    // Update total note count
    updateNoteCount();

}

// Add a new note
noteForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    // Validate empty notes
    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    // Validate character limit
    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    // Clear error message
    errorMessage.textContent = "";

    // Create note object
    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    // Add note to array
    notes.push(newNote);

    // Save and display notes
    saveNotes();
    render();

    // Clear input
    noteInput.value = "";

});

// Search notes as user types
searchInput.addEventListener("input", function() {
    render();
});

// Display saved notes when page loads
render();
