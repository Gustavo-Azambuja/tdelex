const words = [];
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const stateTransitions = {};
const wordStatus = {}; 

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
        // Cria um contêiner para a palavra com a classe de estilo
        const wordContainer = document.createElement('div');
        wordContainer.classList.add('stored-word-container');

        // Cria um elemento de texto para a palavra
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;

        // Cria o botão de exclusão (lixeira) com a classe de estilo
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');

        // Adiciona o ícone de lixeira
        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fas', 'fa-trash');

        // Adiciona o evento de clique para excluir a palavra
        deleteBtn.onclick = () => deleteWord(word);

        // Adiciona o ícone ao botão e o botão ao contêiner
        deleteBtn.appendChild(trashIcon);
        wordContainer.appendChild(deleteBtn);
        wordContainer.appendChild(wordSpan);
        storedWords.appendChild(wordContainer);
    });
}


function deleteWord(word) {
    const wordIndex = words.indexOf(word);
    if (wordIndex > -1) {
        words.splice(wordIndex, 1); // Remove a palavra do array de palavras
        deleteTableEntries(word); // Remove as entradas da tabela
        deleteWordStatus(word); // Remove do status da palavra
        updateStoredWords(); // Atualiza a lista de palavras armazenadas
    }
}

function deleteTableEntries(word) {
    for (let i = 0; i < word.length; i++) {
        const currentLetter = word[i];
        const currentState = `q${i}`;
        const cell = document.getElementById(`${currentState}-${currentLetter}`);

        if (cell) {
            cell.textContent = ''; // Limpa o conteúdo da célula
        }
    }
}

function deleteWordStatus(word) {
    delete wordStatus[word]; // Remove a palavra do status
    updateWordStatus(); // Atualiza a exibição do status das palavras
}

function updateTable(word) {
    const tableBody = document.getElementById('tableBody');

    for (let i = 0; i < word.length; i++) {
        const currentLetter = word[i];
        const nextState = `q${i + 1}`;
        const currentState = `q${i}`;

        if (!stateTransitions[currentState]) {
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
            stateTransitions[currentState] = {};
        }

        const cell = document.getElementById(`${currentState}-${currentLetter}`);
        if (cell && !cell.textContent) {
            // Verifica se a letra é a última da palavra e adiciona o asterisco
            cell.textContent = (i === word.length - 1) ? `${nextState}*` : nextState;
        }
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
    for (let i = 0; i < searchInput.length; i++) {
        const letter = searchInput[i];
        const cell = document.getElementById(`${currentState}-${letter}`);

        if (cell) {
            const expectedState = `q${i + 1}`;
            const expectedFinalState = `${expectedState}*`;

            // Verifica se o conteúdo da célula é o estado esperado ou o estado final com asterisco
            if (cell.textContent === expectedState || cell.textContent === expectedFinalState) {
                cell.classList.add('highlight-green');
                currentState = `q${i + 1}`;
            } else {
                cell.classList.add('highlight-red');
                currentState = `q${i + 1}`;
            }
        }
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
