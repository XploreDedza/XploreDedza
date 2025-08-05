// 🌍 Language Switching
const langContent = {
  en: {
    calculator: "Loan Calculator",
    login: "Group Login",
    education: "Training Resources",
  },
  tk: {
    calculator: "Kucheza Dipo",
    login: "Kulowa Mu Gulu",
    education: "Maphunziro",
  },
};

document.getElementById("lang-toggle")?.addEventListener("change", (e) => {
  const lang = e.target.value;
  document.querySelector("[data-lang='calculator']").textContent = langContent[lang].calculator;
  document.querySelector("#login h2").textContent = langContent[lang].login;
  document.querySelector("#education h2").textContent = langContent[lang].education;
});

// 🔢 Loan Calculator
function calculateLoan() {
  const amount = parseFloat(document.getElementById("loan-amount").value);
  const term = parseInt(document.getElementById("loan-term").value);
  const rate = 0.12;
  if (isNaN(amount) || isNaN(term)) {
    alert("Please enter valid numbers.");
    return;
  }
  const monthlyRate = rate / 12;
  const payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  document.getElementById("monthly-payment").textContent =
    "Monthly Payment: MK " + payment.toFixed(2);
}

// 🔐 Firebase Login
function userLogin(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => alert("Login successful!"))
    .catch((error) => alert("Login failed: " + error.message));
}

// 📊 Admin Dashboard Metrics
const db = firebase.firestore();
db.collection("loans").onSnapshot((snapshot) => {
  let total = 0;
  let repaid = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    total += data.amount;
    if (data.status === "repaid") repaid += data.amount;
  });
  document.getElementById("total-loans").textContent = "MK " + total;
  const rate = total ? ((repaid / total) * 100).toFixed(2) : "0";
  document.getElementById("repayment-rate").textContent = rate + "%";
});

// 📝 Loan Application (apply.html)
document.getElementById("loan-form")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const group = document.getElementById("group-name").value;
  const amount = parseFloat(document.getElementById("loan-amount").value);
  const purpose = document.getElementById("purpose").value;

  db.collection("applications").add({
    group,
    amount,
    purpose,
    submittedAt: new Date()
  }).then(() => {
    document.getElementById("application-status").textContent = "Application submitted successfully!";
  }).catch((error) => {
    document.getElementById("application-status").textContent = "Error: " + error.message;
  });
});

// 💬 Forum Posts (forum.html)
document.getElementById("forum-form")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const topic = document.getElementById("topic").value;
  const message = document.getElementById("message").value;

  db.collection("forumPosts").add({
    topic,
    message,
    createdAt: new Date()
  });

  document.getElementById("topic").value = "";
  document.getElementById("message").value = "";
});

db.collection("forumPosts").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  const postsDiv = document.getElementById("posts");
  if (!postsDiv) return;
  postsDiv.innerHTML = "<h2>Recent Discussions</h2>";
  snapshot.forEach(doc => {
    const data = doc.data();
    const post = document.createElement("div");
    post.innerHTML = `<h3>${data.topic}</h3><p>${data.message}</p><hr>`;
    postsDiv.appendChild(post);
  });
});

// 📢 Notifications (notifications.html)
db.collection("notifications").orderBy("timestamp", "desc").onSnapshot(snapshot => {
  const list = document.getElementById("notification-list");
  if (!list) return;
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const item = document.createElement("li");
    item.textContent = `${data.title}: ${data.message}`;
    list.appendChild(item);
  });
});