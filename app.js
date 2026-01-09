let orderType = "market";
let history = [];

function login() {
  alert("Demo login successful");
}

function transfer() {
  alert("Transferred to Futures (demo)");
}

function setType(type, el) {
  orderType = type;
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
}

function spotOrder(side) {
  const price = (Math.random() * 500 + 40000).toFixed(2);
  const amount = (Math.random() * 0.1).toFixed(3);
  history.unshift({ price, amount, side });
  renderHistory();
  renderOrderBook();
  alert(`Spot ${side.toUpperCase()} ${orderType} order`);
}

function renderHistory() {
  const h = document.getElementById("history");
  if (!h) return;
  h.innerHTML = "";
  history.slice(0, 10).forEach(t => {
    h.innerHTML += `
      <tr>
        <td>${t.price}</td>
        <td>${t.amount}</td>
        <td style="color:${t.side === 'buy' ? '#0ecb81' : '#f6465d'}">${t.side}</td>
      </tr>`;
  });
}

function renderOrderBook() {
  const buy = document.getElementById("buyBook");
  const sell = document.getElementById("sellBook");
  if (!buy || !sell) return;
  buy.innerHTML = sell.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    buy.innerHTML += `<div style="color:#0ecb81">${40000 - i * 10} | 0.${i}</div>`;
    sell.innerHTML += `<div style="color:#f6465d">${40100 + i * 10} | 0.${i}</div>`;
  }
}

function futuresOrder(type) {
  document.getElementById("posType").innerText = type;
  document.getElementById("entry").innerText = "40120.00";
  const pl = (Math.random() * 200 - 100).toFixed(2);
  const plEl = document.getElementById("pl");
  plEl.innerText = `$${pl}`;
  plEl.style.color = pl >= 0 ? "#0ecb81" : "#f6465d";
}

function closePosition() {
  alert("Position closed (demo)");
}

function toggleTheme() {
  document.body.classList.toggle("darker");
}

renderOrderBook();
