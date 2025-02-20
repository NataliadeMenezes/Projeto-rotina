if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(() => {
        console.log("Service Worker registrado com sucesso!");
    }).catch(error => {
        console.log("Erro ao registrar Service Worker:", error);
    });
}

const activities = [
    { name: "1 Acordar", img: "img/imagem1.webp" },
    { name: "2 Trocar de Roupa", img: "img/imagem2.webp" },
    { name: "3 Escovar os Dentes", img: "img/imagem3.webp" },
    { name: "4 Pentear os Cabelos", img: "img/imagem4.webp" },
    { name: "5 Escola", img: "img/imagem5.webp" },
    { name: "6 Café da Manhã", img: "img/imagem6.webp" },
    { name: "7 Escovar os Dentes", img: "img/imagem3.webp"},
    { name: "8 Brincar", img: "img/imagem1.webp"},
    { name: "9 Lanche", img: "img/imagem1.webp" },
    { name: "10 Assistir TV", img: "img/imagem1.webp" },
    { name: "11 Lavar as Mãos", img: "img/imagem1.webp" },
    { name: "12 Almoçar", img: "img/imagem1.webp" },
    { name: "13 Escovar os dentes", img: "img/imagem3.webp"},
    { name: "14 Horário Livre", img: "img/imagem1.webp" },
    { name: "15 Lanche", img: "img/imagem1.webp"},
    { name: "16 Atividades", img: "img/imagem1.webp"},
    { name: "17 Horário Livre", img: "img/imagem1.webp"},
    { name: "18 Tomar Banho", img: "img/imagem1.webp"},
    { name: "19 Jantar", img: "img/imagem1.webp"},
    { name: "20 Escovar os Dentes", img: "img/imagem3.webp"},
    { name: "Dormir", img: "img/imagem1.webp"}
];

let userProgress = JSON.parse(localStorage.getItem("userProgress")) || {
    routineProgress: {},
    waterCount: 0,
    dailyRecord: {}
};

const routineList = document.getElementById("routine-list");
let row;
activities.forEach((activity, index) => {
    if (index % 4 === 0) {
        row = document.createElement("tr");
        routineList.appendChild(row);
    }
    const cell = document.createElement("td");
    cell.innerHTML = `
        <div class="activity">
            <img src="${activity.img}" alt="${activity.name}">
            <span>${activity.name}</span>
            <span class="emoji" onclick="toggleEmoji(this, '${activity.name}')">⬜</span>
        </div>
    `;
    row.appendChild(cell);
});

function toggleEmoji(element, activityName) {
    let savedProgress = userProgress.routineProgress;
    if (element.textContent === "⬜") {
        element.textContent = "😊";
        savedProgress[activityName] = "😊";
    } else if (element.textContent === "😊") {
        element.textContent = "☹️";
        savedProgress[activityName] = "☹️";
    } else {
        element.textContent = "⬜";
        savedProgress[activityName] = "⬜";
    }

    localStorage.setItem("userProgress", JSON.stringify(userProgress));

    if (activityName === "Dormir" && element.textContent === "😊") {
        document.getElementById("goodnight-message").style.display = "block";
    }

    updateProgressBar();
    saveDailyProgress();
}

function updateProgressBar() {
    const totalActivities = activities.length;
    const completedActivities = Object.values(userProgress.routineProgress).filter(status => status === "😊").length;
    const progressPercentage = (completedActivities / totalActivities) * 100;
    document.getElementById("progress-bar").style.width = `${progressPercentage}%`;
    document.getElementById("progress-percentage").textContent = `${progressPercentage.toFixed(2)}%`;
}

const totalCups = 8;
const waterCupsContainer = document.getElementById("water-cups");
let waterCount = userProgress.waterCount;

for (let i = 0; i < totalCups; i++) {
    const cup = document.createElement("span");
    cup.classList.add("water-cup");
    cup.textContent = i < waterCount ? "💧" : "⬜";
    cup.onclick = () => toggleWater(cup, i);
    waterCupsContainer.appendChild(cup);
}

function toggleWater(cup, index) {
    if (cup.textContent === "⬜" && waterCount < totalCups) {
        cup.textContent = "💧";
        waterCount++;
    } else if (cup.textContent === "💧") {
        cup.textContent = "⬜";
        waterCount--;
    }

    userProgress.waterCount = waterCount;
    localStorage.setItem("userProgress", JSON.stringify(userProgress));
    console.log("Copos de água bebidos:", waterCount);
}

function saveDailyProgress() {
    const today = new Date().toISOString().split('T')[0];
    userProgress.dailyRecord[today] = activities.length;
    localStorage.setItem("userProgress", JSON.stringify(userProgress));
    updateMonthlyAverage();
}

function updateMonthlyAverage() {
    const records = Object.values(userProgress.dailyRecord);
    const totalDays = records.length;
    const average = totalDays ? (records.reduce((a, b) => a + b, 0) / (totalDays * activities.length) * 100).toFixed(2) : 0;
    document.getElementById("monthly-average").textContent = `${average}%`;
}

window.onload = function() {
    let savedProgress = userProgress.routineProgress;
    document.querySelectorAll(".emoji").forEach((element, index) => {
        let activityName = activities[index].name;
        if (savedProgress[activityName]) {
            element.textContent = savedProgress[activityName];
        }
    });

    if (savedProgress["21 Dormir"] === "😊") {
        document.getElementById("goodnight-message").style.display = "block";
    }

    updateProgressBar();
};

function resetDailyProgress() {
    // Zerar o progresso das atividades
    userProgress.routineProgress = {};

    // Zerar a quantidade de água consumida
    userProgress.waterCount = 0;

    // Atualizar o localStorage
    localStorage.setItem("userProgress", JSON.stringify(userProgress));

    // Atualizar a interface
    document.querySelectorAll(".emoji").forEach((element) => {
        element.textContent = "⬜"; // Resetar todos os emojis para "não concluído"
    });

    // Resetar os copos de água
    const waterCupsContainer = document.getElementById("water-cups");
    const waterCups = waterCupsContainer.getElementsByClassName("water-cup");
    for (let i = 0; i < waterCups.length; i++) {
        waterCups[i].textContent = "⬜"; // Resetar todos os copos de água para "não bebido"
    }

    // Resetar a barra de progresso
    updateProgressBar();
    document.getElementById("goodnight-message").style.display = "none"; // Esconder a mensagem de boa noite
}
