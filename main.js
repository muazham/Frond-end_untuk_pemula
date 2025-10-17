const STORAGE_KEY = 'BOOKSHELF_APP';
let books = [];
let editingBookId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadBooksFromStorage();
    renderAllBooks();
    setupEventListeners();
});

function setupEventListeners() {
    const bookForm = document.getElementById('bookForm');
    const searchForm = document.getElementById('searchBook');
    const isCompleteCheckbox = document.getElementById('bookFormIsComplete');
    
    bookForm.addEventListener('submit', handleAddBook);
    searchForm.addEventListener('submit', handleSearchBook);
    isCompleteCheckbox.addEventListener('change', updateFormButtonText);
}

function loadBooksFromStorage() {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    }
}

function saveBooksToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function handleAddBook(event) {
    event.preventDefault();
    
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    
    if (editingBookId !== null) {
        updateBook(editingBookId, title, author, year, isComplete);
        editingBookId = null;
        resetFormButton();
    } else {
        addBook(title, author, year, isComplete);
    }
    
    event.target.reset();
    updateFormButtonText();
    renderAllBooks();
}

function addBook(title, author, year, isComplete) {
    const book = {
        id: Number(new Date()),
        title: title,
        author: author,
        year: year,
        isComplete: isComplete
    };
    
    books.push(book);
    saveBooksToStorage();
}

function updateBook(id, title, author, year, isComplete) {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
        books[bookIndex].title = title;
        books[bookIndex].author = author;
        books[bookIndex].year = year;
        books[bookIndex].isComplete = isComplete;
        saveBooksToStorage();
    }
}

function deleteBook(id) {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        saveBooksToStorage();
        renderAllBooks();
    }
}

function toggleBookStatus(id) {
    const book = books.find(book => book.id === id);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooksToStorage();
        renderAllBooks();
    }
}

function editBook(id) {
    const book = books.find(book => book.id === id);
    if (book) {
        document.getElementById('bookFormTitle').value = book.title;
        document.getElementById('bookFormAuthor').value = book.author;
        document.getElementById('bookFormYear').value = book.year;
        document.getElementById('bookFormIsComplete').checked = book.isComplete;
        
        editingBookId = id;
        
        const submitButton = document.getElementById('bookFormSubmit');
        submitButton.innerHTML = 'Update Buku';
        
        document.getElementById('bookFormTitle').focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function resetFormButton() {
    const submitButton = document.getElementById('bookFormSubmit');
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    const status = isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca';
    submitButton.innerHTML = `Masukkan Buku ke rak <span>${status}</span>`;
}

function updateFormButtonText() {
    if (editingBookId === null) {
        const isComplete = document.getElementById('bookFormIsComplete').checked;
        const submitButton = document.getElementById('bookFormSubmit');
        const status = isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca';
        submitButton.innerHTML = `Masukkan Buku ke rak <span>${status}</span>`;
    }
}

function renderAllBooks(filteredBooks = null) {
    const booksToRender = filteredBooks !== null ? filteredBooks : books;
    
    const incompleteList = document.getElementById('incompleteBookList');
    const completeList = document.getElementById('completeBookList');
    
    incompleteList.innerHTML = '';
    completeList.innerHTML = '';
    
    booksToRender.forEach(book => {
        const bookElement = createBookElement(book);
        
        if (book.isComplete) {
            completeList.appendChild(bookElement);
        } else {
            incompleteList.appendChild(bookElement);
        }
    });
}

function createBookElement(book) {
    const bookDiv = document.createElement('div');
    bookDiv.setAttribute('data-bookid', book.id);
    bookDiv.setAttribute('data-testid', 'bookItem');
    
    const title = document.createElement('h3');
    title.setAttribute('data-testid', 'bookItemTitle');
    title.textContent = book.title;
    
    const author = document.createElement('p');
    author.setAttribute('data-testid', 'bookItemAuthor');
    author.textContent = `Penulis: ${book.author}`;
    
    const year = document.createElement('p');
    year.setAttribute('data-testid', 'bookItemYear');
    year.textContent = `Tahun: ${book.year}`;
    
    const buttonContainer = document.createElement('div');
    
    const toggleButton = document.createElement('button');
    toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    toggleButton.addEventListener('click', function() {
        toggleBookStatus(book.id);
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.textContent = 'Hapus Buku';
    deleteButton.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
            deleteBook(book.id);
        }
    });
    
    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.textContent = 'Edit Buku';
    editButton.addEventListener('click', function() {
        editBook(book.id);
    });
    
    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(editButton);
    
    bookDiv.appendChild(title);
    bookDiv.appendChild(author);
    bookDiv.appendChild(year);
    bookDiv.appendChild(buttonContainer);
    
    return bookDiv;
}

function handleSearchBook(event) {
    event.preventDefault();
    
    const searchQuery = document.getElementById('searchBookTitle').value.toLowerCase().trim();
    
    if (searchQuery === '') {
        renderAllBooks();
        return;
    }
    
    const filteredBooks = books.filter(function(book) {
        return book.title.toLowerCase().includes(searchQuery);
    });
    
    renderAllBooks(filteredBooks);
}