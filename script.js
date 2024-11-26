const words = [];
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const stateTransitions = {}; 
const wordStatus = {};
let globalStateCounter = 1;

function initializeTable() {
    const headerRow = document.getElementById('headerRow');
    headerRow.innerHTML = '<th>δ</th>';
    for (let letter of alphabet) {
        const th = document.createElement('th');
        th.textContent = letter.toUpperCase();
        headerRow.appendChild(th);
    }
}

function addWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.toLowerCase();
    if (!word) return;

    if (!words.includes(word)) {
        words.push(word);
        updateStoredWords();
        updateTable(word);
    }
    wordInput.value = '';
}

function updateStoredWords() {
    const storedWords = document.getElementById('storedWords');
    storedWords.innerHTML = "Palavras armazenadas: ";
    words.forEach(word => {
        const wordContainer = document.createElement('div');
        wordContainer.classList.add('stored-word-container');

        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fas', 'fa-trash');

        deleteBtn.onclick = () => deleteWord(word);

        deleteBtn.appendChild(trashIcon);
        wordContainer.appendChild(deleteBtn);
        wordContainer.appendChild(wordSpan);
        storedWords.appendChild(wordContainer);
    });
}

function deleteWord(word) {
    const wordIndex = words.indexOf(word);
    if (wordIndex > -1) {
        words.splice(wordIndex, 1); 
        deleteTableEntries(word); /
        deleteWordStatus(word); 
        updateStoredWords(); 
    }
}

function deleteTableEntries(word) {
    let currentState = 'q0'; 

    for (let i = 0; i < word.length; i++) {
        const currentLetter = word[i];
        const cell = document.getElementById(`${currentState}-${currentLetter}`);

        if (cell && cell.textContent) {
            const nextState = cell.textContent.replace('*', ''); 
            cell.textContent = ''; 
            currentState = nextState;
        } else {
            break; 
        }
    }
}

function deleteWordStatus(word) {
    delete wordStatus[word];
    updateWordStatus();
}

function updateTable(word) {
    const tableBody = document.getElementById('tableBody');
    let currentState = 'q0';

    for (let i = 0; i < word.length; i++) {
        const currentLetter = word[i];
        const nextState = `q${globalStateCounter}`;

        if (!stateTransitions[currentState]) {
            stateTransitions[currentState] = {};
            const row = document.createElement('tr');

            const firstCell = document.createElement('td');
            firstCell.textContent = currentState;
            row.appendChild(firstCell);

            for (let l of alphabet) {
                const cell = document.createElement('td');
                cell.classList.add(`${l}`);
                cell.id = `${currentState}-${l}`;
                row.appendChild(cell);
            }

            tableBody.appendChild(row);
        }

        const cell = document.getElementById(`${currentState}-${currentLetter}`);
        if (cell && !cell.textContent) {
     
            cell.textContent = (i === word.length - 1) ? `${nextState}*` : nextState;
        }

        stateTransitions[currentState][currentLetter] = nextState;
        currentState = nextState;
        globalStateCounter++; 
    }
}

function generateWord() {
    const randomLength = Math.floor(Math.random() * 5) + 3;
    let randomWord = '';
    for (let i = 0; i < randomLength; i++) {
        randomWord += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    if (!words.includes(randomWord)) {
        words.push(randomWord);
        updateStoredWords();
        updateTable(randomWord);
    }
}

function searchWord() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    const allCells = document.querySelectorAll('#wordTable td');
    allCells.forEach(cell => cell.classList.remove('highlight-green', 'highlight-red')); 

    let currentState = 'q0'; 
    let isWordValid = true;
    for (let i = 0; i < searchInput.length; i++) {
        const letter = searchInput[i];
        const cell = document.getElementById(`${currentState}-${letter}`);

        if (cell && cell.textContent) {
            const nextState = cell.textContent.replace('*', ''); 
            cell.classList.add('highlight-green'); 
            currentState = nextState; 
        } else {
          
            if (cell) cell.classList.add('highlight-red');
            isWordValid = false;
            break;
        }
    }

    if (isWordValid && currentState.includes('*')) {
        console.log(`A palavra "${searchInput}" está na tabela.`);
    } else {
        console.log(`A palavra "${searchInput}" não está na tabela.`);
    }
}

function checkIfStored(event) {
    if (event.key === ' ') {
        const searchInput = document.getElementById('searchInput');
        const word = searchInput.value.trim().toLowerCase();

        if (words.includes(word)) {
            wordStatus[word] = true;
        } else {
            wordStatus[word] = false;
        }

        searchInput.value = '';
        searchWord();
        updateWordStatus();
    }
}

function updateWordStatus() {
    const usedWordsList = document.getElementById('usedWordsList');
    const unusedWordsList = document.getElementById('unusedWordsList');
    usedWordsList.innerHTML = '';
    unusedWordsList.innerHTML = '';

    for (const word in wordStatus) {
        const listItem = document.createElement('li');
        listItem.textContent = word;

        if (wordStatus[word]) {
            usedWordsList.appendChild(listItem);
        } else {
            unusedWordsList.appendChild(listItem);
        }
    }
}

function clearSearchInput() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
}

initializeTable();
document.getElementById('searchInput').addEventListener('focus', clearSearchInput);
