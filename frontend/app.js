const API_URL = "http://localhost:3000/api";
let token = "";
let currentQuizId = null;
let timerInterval;
let timeLeft = 0;

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            token = data.token;
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("quiz-list-section").style.display = "block";
            document.getElementById("history-section").style.display = "block";
            loadQuizzes();
            loadHistory();
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role === "admin") {
                document.getElementById("admin-section").style.display = "block";
                refreshAdminQuizzes();
            }
        });
}

function alertAndReset(data) {
    alert(data.message || "Success");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

function loadQuizzes() {
    fetch(`${API_URL}/quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(data => {
            const ul = document.getElementById("quiz-list");
            ul.innerHTML = "";
            data.quizzes.forEach(q => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${q.title}</strong> - <button onclick="startQuiz(${q.id})">Start</button>`;
                ul.appendChild(li);
            });
        });
}

function startQuiz(id) {
    currentQuizId = id;
    fetch(`${API_URL}/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(data => {
            const quiz = data.quiz;
            timeLeft = quiz.time_limit;
            document.getElementById("quiz-title").innerText = quiz.title;
            document.getElementById("quiz-list-section").style.display = "none";
            document.getElementById("quiz-section").style.display = "block";
            const form = document.getElementById("quiz-form");
            form.innerHTML = "";
            quiz.Questions.forEach((q, index) => {
                const fieldset = document.createElement("fieldset");
                fieldset.innerHTML = `<legend>${q.question_text}</legend>`;
                q.options.forEach((opt, i) => {
                    const id = `q${index}_opt${i}`;
                    fieldset.innerHTML += `
        <input type="radio" name="q${index}" id="${id}" value="${i}">
        <label for="${id}">${opt}</label><br/>
      `;
                });
                form.appendChild(fieldset);
            });

            startTimer();
        });
}

function startTimer() {
    const display = document.getElementById("timer");
    display.innerText = `Time left: ${timeLeft} seconds`;

    timerInterval = setInterval(() => {
        timeLeft -= 1;
        display.innerText = `Time left: ${timeLeft} seconds`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function submitQuiz() {
    clearInterval(timerInterval);
    const form = document.getElementById("quiz-form");
    const answers = [];
    const questions = form.querySelectorAll("fieldset");

    questions.forEach((q, index) => {
        const selected = q.querySelector(`input[name="q${index}"]:checked`);
        answers[index] = selected ? parseInt(selected.value) : -1;
    });

    fetch(`${API_URL}/quizzes/${currentQuizId}/submit`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ answers })
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("quiz-section").style.display = "none";
            document.getElementById("result-section").style.display = "block";
            document.getElementById("result-text").innerText = `Score: ${data.score}/${data.total}`;
            loadHistory();
        });
}

function loadHistory() {
    fetch(`${API_URL}/results`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("history-list");
            list.innerHTML = "";
            data.results.forEach(r => {
                const li = document.createElement("li");
                li.innerText = `${r.Quiz.title} | Attempt ${r.attempt} | Score: ${r.score}/${r.total}`;
                list.appendChild(li);
            });
        });
}

function isAdmin(tokenPayload) {
    return tokenPayload.role === "admin";
}

function createQuiz() {
    const title = document.getElementById("new-quiz-title").value;
    const time_limit = parseInt(document.getElementById("new-quiz-timer").value);

    fetch(`${API_URL}/quizzes`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, time_limit })
    })
        .then(res => res.json())
        .then(data => {
            alert("Quiz created");
            loadQuizzes();
            refreshAdminQuizzes();
        });
}

function addQuestion() {
    const quizId = document.getElementById("quiz-select").value;
    const question_text = document.getElementById("question-text").value;
    const options = [
        document.getElementById("opt0").value,
        document.getElementById("opt1").value,
        document.getElementById("opt2").value,
        document.getElementById("opt3").value
    ];
    const correct_option_index = parseInt(document.getElementById("correct-index").value);

    fetch(`${API_URL}/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ question_text, options, correct_option_index })
    })
        .then(res => res.json())
        .then(data => {
            alert("Question added");
            document.getElementById("question-text").value = "";
            document.getElementById("opt0").value = "";
            document.getElementById("opt1").value = "";
            document.getElementById("opt2").value = "";
            document.getElementById("opt3").value = "";
            document.getElementById("correct-index").value = "";
        });
}

function refreshAdminQuizzes() {
    fetch(`${API_URL}/quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("quiz-select");
            select.innerHTML = "";
            data.quizzes.forEach(q => {
                const opt = document.createElement("option");
                opt.value = q.id;
                opt.text = q.title;
                select.appendChild(opt);
            });
        });
}

function renderQuiz(questions) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';
    questions.forEach((q, i) => {
        const qBox = document.createElement('div');
        qBox.innerHTML = `
        <p>${i + 1}. ${q.question_text}</p> ${q.options.map((opt, idx) => ` <label> <input type="radio" name="q${q.id}" value="${idx}" /> ${opt} </label><br/> `).join('')} `;
        container.appendChild(qBox);
    });
}