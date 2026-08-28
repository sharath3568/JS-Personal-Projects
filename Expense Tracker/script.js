const expenseDescriptionInput = document.getElementById("expenseDescriptionInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");
const addExpenseButton = document.getElementById("addExpenseButton"); const expenseTableBody = document.getElementById("expenseTableBody");
const totalBalance = document.getElementById("totalBalanceDisplay");
const expenses = [];

try {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
        expenses.push(...JSON.parse(savedExpenses));
    }
}
catch (error) {
    console.error("Error parsing tasks from localStorage:", error.message);
}
renderExpenses(expenses);
let expenseTracker = getNextExpenseId(expenses);

addExpenseButton.addEventListener("click", function () {
    if (expenseDescriptionInput.value.trim() === "" || amountInput.value.trim() === "" || categoryInput.value.trim() === "") {
        alert("Please provide Input");
        return;
    }
    addExpense();
})

expenseTableBody.addEventListener("click", function (event) {
    const action = event.target.dataset.action;
    const id = Number(event.target.dataset.id);
    if (action === "delete") {
        //const expense = expenses.filter(e => e.id === id);
        const index = expenses.findIndex(e => e.id === id);
        expenses.splice(index, 1);
        saveExpenses(expenses);
        renderExpenses(expenses);
    }
})

function addExpense() {
    const expense = {
        id: expenseTracker,
        description: expenseDescriptionInput.value,
        amount: Number(amountInput.value),
        category: categoryInput.value
    }
    expenses.push(expense);
    expenseTracker++;
    saveExpenses(expenses);
    renderExpenses(expenses);
}

function renderExpense(expense) {
    const tableRow = document.createElement("tr");
    const id = document.createElement("td");
    const description = document.createElement("td");
    const amount = document.createElement("td");
    const categorySpan = document.createElement("span");
    const category = document.createElement("td");
    const deleteAction = document.createElement("td");
    const deleteButton = document.createElement("button");

    deleteButton.dataset.id = expense.id;
    deleteButton.dataset.action = "delete";

    id.textContent = expense.id;
    description.textContent = expense.description;
    amount.textContent = expense.amount;
    categorySpan.textContent = expense.category;
    deleteButton.textContent = "🗑️";
    deleteAction.style.textAlign = "center"
    deleteButton.className = "delete-row-btn";

    switch (expense.category) {
        case "food":
            categorySpan.className = "badge badge-food";
            break;
        case "transport":
            categorySpan.className = "badge badge-transport";
            break;
        case "entertainment":
            categorySpan.className = "badge badge-entertainment";
            break;
        case "other":
            categorySpan.className = "badge badge-other";
            break;
    }

    tableRow.appendChild(id);
    tableRow.appendChild(description);
    tableRow.appendChild(amount);
    category.appendChild(categorySpan);
    tableRow.appendChild(category);
    deleteAction.appendChild(deleteButton);
    tableRow.appendChild(deleteAction);

    expenseTableBody.appendChild(tableRow);

    expenseDescriptionInput.value = "";
    amountInput.value = "";
    categoryInput.value = "select";
}

function renderExpenses(expenseArray) {
    expenseTableBody.innerHTML = "";
    totalBalance.textContent = calculateTotal(expenseArray);
    if (expenseArray.length == 0) {
        document.getElementById("emptyState").classList.remove("hidden");
        return;
    }

    document.getElementById("emptyState").classList.add("hidden");
    expenseArray.forEach(function (expense) {
        renderExpense(expense);
    })
}

function getNextExpenseId(expenseArray) {
    if (expenseArray.length === 0) {
        return 1;
    }
    else {
        const expenseIds = expenseArray.map(function (expense) {
            return expense.id;
        })
        return Math.max(...expenseIds) + 1;
    }
}

function saveExpenses(expenses) {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function calculateTotal(expenseArray) {
    const amount = expenseArray.reduce(function (count, expense) {
        return count + expense.amount;
    }, 0)

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}