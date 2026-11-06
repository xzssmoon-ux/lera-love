let currentF1Page = 1;
let currentF3Page = 1;
let currentF4Page = 1;
let visitorName = "";

let unlockedFolders = parseInt(localStorage.getItem('leraUnlocked')) || 1;
let historyLog = JSON.parse(localStorage.getItem('leraHistory')) || [];

// Загрузка прогресса при старте
window.onload = function() {
    updateFoldersUI();
};

function updateFoldersUI() {
    for (let i = 1; i <= 5; i++) {
        const btn = document.getElementById('folder-btn-' + i);
        if (i <= unlockedFolders) {
            btn.classList.remove('locked');
            btn.innerHTML = '📁 Папка ' + i;
        } else {
            btn.classList.add('locked');
            btn.innerHTML = '🔒 Папка ' + i;
        }
    }
}

function loginUser() {
    const name = document.getElementById('visitorName').value;
    if (name.trim() === "") {
        alert("Пожалуйста, напиши своё имя 🙈");
        return;
    }
    visitorName = name;
    saveAction("Вход на сайт", "Зашел как: " + visitorName);
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('menu-screen').style.display = 'flex';
}

function backToMenu() {
    const books = document.querySelectorAll('.book');
    books.forEach(b => b.style.display = 'none');
    document.getElementById('menu-screen').style.display = 'flex';
    document.body.style.backgroundColor = '#ffe6e6';
}

function checkLock(num) {
    if (num > unlockedFolders) {
        alert("Сначала пройди предыдущую папку! 🔒");
        return;
    }
    startFolder(num);
}

function startFolder(num) {
    const books = document.querySelectorAll('.book');
    books.forEach(b => b.style.display = 'none');
    
    if (num === 1) {
        document.getElementById('folder1').style.display = 'flex';
        document.body.style.backgroundColor = '#ffebf0';
    } else if (num === 2) {
        document.getElementById('folder2').style.display = 'flex';
        document.body.style.backgroundColor = '#b2ebf2';
    } else if (num === 3) {
        document.getElementById('folder3').style.display = 'flex';
        document.body.style.backgroundColor = '#a5d6a7';
    } else if (num === 4) {
        document.getElementById('folder4').style.display = 'flex';
        document.body.style.backgroundColor = '#ffcc80';
    } else if (num === 5) {
        document.getElementById('folder5').style.display = 'flex';
        document.body.style.backgroundColor = '#d1c4e9';
    }
}

// Функция, вызываемая при завершении папки
function finishFolder(num) {
    if (unlockedFolders < num + 1) {
        unlockedFolders = num + 1;
        localStorage.setItem('leraUnlocked', unlockedFolders);
    }
    updateFoldersUI();
    backToMenu();
}

// Универсальная функция сохранения
function saveAction(question, answer) {
    const now = new Date();
    const timeStr = now.toLocaleString('ru-RU', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
    
    historyLog.push({
        time: timeStr,
        name: visitorName,
        question: question,
        answer: answer
    });
    
    localStorage.setItem('leraHistory', JSON.stringify(historyLog));
}

// Сердечки
function createHearts() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    const icons = ['❤️', '💖', '💕', '💗', '💓'];
    heart.innerHTML = icons[Math.floor(Math.random() * icons.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 3 + 's';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    container.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 6000);
}
setInterval(createHearts, 300);

// --- ПАПКА 1 ---
function nextF1(page) {
    document.getElementById('f1-p' + currentF1Page).classList.remove('active');
    currentF1Page = page;
    document.getElementById('f1-p' + currentF1Page).classList.add('active');
}

// --- ПАПКА 3 ---
function nextF3(page) {
    document.getElementById('f3-p' + currentF3Page).classList.remove('active');
    currentF3Page = page;
    document.getElementById('f3-p' + currentF3Page).classList.add('active');
}

function handleQ1(answer) {
    saveAction("1. Ты красивая?", answer);
    const ans1Text = document.getElementById('ans1-text');
    const q2Block = document.getElementById('q2-block');
    
    if (answer === 'Да, я красотка') ans1Text.innerHTML = "Конечно так, это же очевидно! 😉❤️";
    else if (answer === 'Я няшная') ans1Text.innerHTML = "Да, ты очень няшная и милая! 🥰❤️";
    else if (answer === 'Нет') ans1Text.innerHTML = "Неправда! Вообще-то ты очень красивая и милая! 😘❤️";
    
    ans1Text.classList.add('show');
    nextF3(2);
    setTimeout(() => {
        q2Block.style.display = "block";
        q2Block.classList.add('show');
    }, 3000);
}

function submitTextAns() {
    const text = document.getElementById('whoAmI').value;
    if (text.trim() === "") { alert("Напиши хоть что-нибудь 🙈"); return; }
    saveAction("2. Кто я для тебя?", text);
    nextF3(3);
}

function handleQ3(isYes) {
    const answer = isYes ? "Да" : "Нет";
    saveAction("3. Ты мне доверяешь?", answer);
    const trustText = document.getElementById('trust-text');
    const q4Block = document.getElementById('q4-block');
    
    trustText.innerHTML = isYes ? "Спасибо, солнышко! ❤️" : ""; 
    if(isYes) trustText.classList.add('show');
    
    nextF3(4);
    setTimeout(() => {
        q4Block.style.display = "block";
        q4Block.classList.add('show');
    }, 3000);
}

function handleQ4(isYes) {
    if (isYes) {
        document.getElementById('q4-block').style.display = "none";
        document.getElementById('q4-repeat-block').style.display = "block";
    } else {
        saveAction("4. Ты меня любишь?", "Нет");
        nextF3(5);
    }
}

function handleQ4Final(answer) {
    saveAction("4. Ты меня любишь? (Переспрос)", answer);
    nextF3(5);
}

function submitOpinion() {
    const text = document.getElementById('myOpinion').value;
    if (text.trim() === "") { alert("Напиши хоть что-нибудь 🙈"); return; }
    saveAction("5. Какое мнение обо мне?", text);
    nextF3(6);
}

// --- ПАПКА 4 ---
function nextF4(page) {
    document.getElementById('f4-p' + currentF4Page).classList.remove('active');
    currentF4Page = page;
    document.getElementById('f4-p' + currentF4Page).classList.add('active');
}

function submitF4(qNum) {
    let text = "";
    let question = "";
    
    if (qNum === 1) {
        text = document.getElementById('feelNow').value;
        question = "П4: Что ты чувствуешь прямо сейчас?";
    } else if (qNum === 2) {
        text = document.getElementById('dreamAbout').value;
        question = "П4: О чём ты мечтаешь?";
    } else if (qNum === 3) {
        text = document.getElementById('wannaSay').value;
        question = "П4: Что бы ты хотела мне сказать?";
    }
    
    if (text.trim() === "") { alert("Напиши хоть что-нибудь 🙈"); return; }
    
    saveAction(question, text);
    nextF4(qNum + 1);
}

// --- ПАПКА 5 ---
function checkSecretPass() {
    const pass = document.getElementById('secretPass').value;
    if (pass === '1110') {
        document.getElementById('f5-p1').classList.remove('active');
        document.getElementById('f5-p2').classList.add('active');
        
        let dataText = "";
        if (historyLog.length === 0) {
            dataText = "Пока нет действий.";
        } else {
            historyLog.forEach(item => {
                dataText += `[${item.time}]\nИмя: ${item.name || "Неизвестно"}\nВопрос: ${item.question}\nОтвет: ${item.answer}\n\n`;
            });
        }
        document.getElementById('admin-data').innerText = dataText.trim();
    } else {
        alert("Неверный пароль!");
    }
}
