let spotBalance = 1000;
let futuresBalance = 0;
let position = null;
let tradeHistory = [];
let side = "long";

const prices = {
  BTCUSDT: 42000,
  ETHUSDT: 2200
};

function login() {
  const email = document.getElementById("email").value;
  localStorage.setItem("user", email);
  alert("Welcome " + email);
}

function deposit() {
  const amt = Number(document.getElementById("depositAmount").value);
  spotBalance += amt;
  updateUI();
}

function transfer() {
  const amt = Number(document.getElementById("transferAmount").value);
  if (spotBalance >= amt) {
    spotBalance -= amt;
    futuresBalance += amt;
    updateUI();
  }
}

function setSide(s) {
  side = s;
}

function openTrade() {
  if (position) return alert("Close existing trade first");

  const pair = document.getElementById("pair").value;
  const amount = Number(document.getElementById("amount").value);
  const leverage = Number(document.getElementById("leverage").value);

  if (amount > futuresBalance) return alert("Insufficient futures balance");

  futuresBalance -= amount;

  position = {
    pair,
    amount,
    leverage,
    entry: prices[pair],
    side
  };

  updateUI();
}

function closeTrade() {
  if (!position) return;

  const pnl = calculatePNL();
  futuresBalance += position.amount + pnl;

  tradeHistory.push({
    pair: position.pair,
    side: position.side,
    pnl: pnl.toFixed(2),
    time: new Date().toLocaleString()
  });

  position = null;
  updateUI();
  renderHistory();
}

function calculatePNL() {
  const currentPrice = prices[position.pair];
  const diff = (currentPrice - position.entry) * position.leverage;
  return position.side === "long" ? diff : -diff;
}

function liquidationCheck() {
  if (!position) return;

  const liqPrice = position.entry / position.leverage;
  const price = prices[position.pair];

  if (
    (position.side === "long" && price <= position.entry - liqPrice) ||
    (position.side === "short" && price >= position.entry + liqPrice)
  ) {
    alert("Position Liquidated");
    position = null;
    updateUI();
  }
}

function updateUI() {
  document.getElementById("spot").textContent = spotBalance.toFixed(2);
  document.getElementById("futures").textContent = futuresBalance.toFixed(2);
  document.getElementById("positionInfo").textContent =
    position ? `Open ${position.side.toUpperCase()} ${position.pair}` : "No open position";
}

function renderHistory() {
  const history = document.getElementById("history");
  history.innerHTML = "";
  tradeHistory.forEach(t => {
    history.innerHTML += `<li>${t.time} | ${t.side} | ${t.pnl} USDT</li>`;
  });
}

/* Price simulation */
setInterval(() => {
  prices.BTCUSDT += (Math.random() - 0.5) * 200;
  prices.ETHUSDT += (Math.random() - 0.5) * 20;
  liquidationCheck();
}, 2000);

/* Simple demo chart */
const ctx = document.getElementById("chart").getContext("2d");
function drawChart() {
  ctx.clearRect(0, 0, 360, 180);
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = "#f0b90b";
    ctx.fillRect(i * 18, 90 + Math.random() * 40, 8, 40);
  }
}
setInterval(drawChart, 1500);

updateUI();
