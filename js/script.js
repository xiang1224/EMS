// 讀取學生數據
async function fetchStudentData() {
    const response = await fetch('./data/data.json'); // 調整相對路徑
    return await response.json();
}

// 登入功能
async function login() {
    const studentID = document.getElementById('studentID').value;
    const password = document.getElementById('password').value;
    const students = await fetchStudentData();

    const student = students.find(s => s.id === studentID && s.password === password);

    if (student) {
        localStorage.setItem('loggedInStudent', JSON.stringify(student));
        window.location.href = './grades.html'; // 跳轉到成績頁面
    } else {
        document.getElementById('error-message').innerText = "帳號或密碼錯誤";
    }
}

// 顯示個人成績（多次考試）
function displayGrade() {
    const student = JSON.parse(localStorage.getItem('loggedInStudent'));

    if (!student) {
        window.location.href = './index.html'; // 沒登入就跳回首頁
        return;
    }

    document.getElementById('studentName').innerText = student.name;

    const gradesTable = document.getElementById('gradesTable');
    gradesTable.innerHTML = ""; // 清空表格

    student.grades.forEach(grade => {
        let row = `<tr><td>${grade.exam}</td><td>${grade.score}</td></tr>`;
        gradesTable.innerHTML += row;
    });
}

// 登出功能
function logout() {
    localStorage.removeItem('loggedInStudent');
    window.location.href = './index.html';
}

// 如果在成績頁面則自動顯示成績
if (window.location.pathname.includes('grades.html')) {
    displayGrade();
}
