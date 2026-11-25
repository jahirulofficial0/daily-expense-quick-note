"use strict";

// Expenses are stored as an array of {amount:number, note:string, ts:number}
// under the key "expenses" in chrome.storage.local. Nothing leaves the device.

const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");
const listEl = document.getElementById("today-list");
const emptyMsg = document.getElementById("empty-msg");
const todayTotalEl = document.getElementById("today-total");
const monthTotalEl = document.getElementById("month-total");

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function sameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function money(n) {
  return n.toFixed(2);
}

async function loadExpenses() {
  const data = await chrome.storage.local.get({ expenses: [] });
  return data.expenses;
}

async function saveExpenses(expenses) {
  await chrome.storage.local.set({ expenses });
}

async function render() {
  const expenses = await loadExpenses();
  const now = new Date();
  const todayStart = startOfDay(now);

  const todays = expenses.filter((e) => e.ts >= todayStart);
  const thisMonth = expenses.filter((e) => sameMonth(new Date(e.ts), now));

  todayTotalEl.textContent = money(todays.reduce((s, e) => s + e.amount, 0));
  monthTotalEl.textContent = money(thisMonth.reduce((s, e) => s + e.amount, 0));

  listEl.innerHTML = "";
  emptyMsg.style.display = todays.length ? "none" : "block";

  todays
    .slice()
    .reverse()
    .forEach((e) => {
      const li = document.createElement("li");
      const time = new Date(e.ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const label = document.createElement("span");
      label.textContent = `${time} — ${e.note}`;
      const amt = document.createElement("strong");
      amt.textContent = money(e.amount);
      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "x";
      del.title = "Delete this entry";
      del.addEventListener("click", async () => {
        const all = await loadExpenses();
        const idx = all.findIndex(
          (x) => x.ts === e.ts && x.amount === e.amount && x.note === e.note
        );
        if (idx >= 0) {
          all.splice(idx, 1);
          await saveExpenses(all);
          render();
        }
      });
      li.append(label, amt, del);
      listEl.appendChild(li);
    });
}

document.getElementById("add-form").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const amount = parseFloat(amountInput.value);
  const note = noteInput.value.trim();
  if (!Number.isFinite(amount) || amount <= 0 || !note) return;
  const expenses = await loadExpenses();
  expenses.push({ amount, note, ts: Date.now() });
  await saveExpenses(expenses);
  amountInput.value = "";
  noteInput.value = "";
  amountInput.focus();
  render();
});

document.getElementById("export-btn").addEventListener("click", async () => {
  const expenses = await loadExpenses();
  const now = new Date();
  const rows = [["date", "time", "amount", "note"]];
  expenses
    .filter((e) => sameMonth(new Date(e.ts), now))
    .forEach((e) => {
      const d = new Date(e.ts);
      const note = '"' + e.note.replace(/"/g, '""') + '"';
      rows.push([
        d.toISOString().slice(0, 10),
        d.toLocaleTimeString(),
        money(e.amount),
        note,
      ]);
    });
  const csv = rows.map((r) => r.join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("clear-btn").addEventListener("click", async () => {
  if (confirm("Delete ALL saved expenses? This cannot be undone.")) {
    await saveExpenses([]);
    render();
  }
});

render();
