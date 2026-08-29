const expenseDescriptionInput = document.getElementById("expenseDescriptionInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");
const addExpenseButton = document.getElementById("addExpenseButton"); const expenseTableBody = document.getElementById("expenseTableBody");
const filterPillContainer = document.getElementById("filterPillContainer");
const totalBalance = document.getElementById("totalBalanceDisplay");
const foodSummary = document.getElementById("summaryFoodValue");
const transportSummary = document.getElementById("summaryTransportValue");
const entertainmentSummary = document.getElementById("summaryEntertainmentValue");
const otherSummary = document.getElementById("summaryOtherValue");
const emptyState = document.getElementById("emptyState")
const cancelEditButton = document.getElementById("cancelEditButton");
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

let currentFilter = "all";
let editingExpenseId = null;

renderExpenses(expenses);
let expenseTracker = getNextExpenseId(expenses);

addExpenseButton.addEventListener("click", function () {
    if (editingExpenseId === null) {
        if (expenseDescriptionInput.value.trim() === "" || amountInput.value.trim() <= 0 || categoryInput.value.trim() === "") {
            alert("Please provide Input");
            return;
        }
        addExpense();
    }
    else {
        const updated = updateExpense(editingExpenseId);

        if (updated) {
            exitEditMode();
            renderCurrentFilter();
        }
    }
})

cancelEditButton.addEventListener("click", function (event) {
    exitEditMode();
    renderCurrentFilter();
})

expenseTableBody.addEventListener("click", function (event) {
    const action = event.target.dataset.action;
    const id = Number(event.target.dataset.id);
    const index = expenses.findIndex(e => e.id === id);
    if (action === "delete") {
        expenses.splice(index, 1);
        saveExpenses(expenses);
        renderCurrentFilter();
    }
    if (action === "edit") {
        editingExpenseId = id;
        addExpenseButton.className = "updateExpenseButton";
        addExpenseButton.querySelector("span").textContent = "✓";
        addExpenseButton.querySelector(".btn-text").textContent = "Update Expense";
        cancelEditButton.classList.add("is-visible");

        const expense = expenses.find(e => e.id === id);
        expenseDescriptionInput.value = expense.description;
        amountInput.value = expense.amount;
        categoryInput.value = expense.category;
    }
})

filterPillContainer.addEventListener("click", function (event) {
    const filter = event.target.dataset.filter;
    const clickedButton = event.target.closest('.filter-pill');

    const currentActive = filterPillContainer.querySelector('.filter-pill.active');

    if (currentActive) {
        currentActive.classList.remove('active');
    }

    clickedButton.classList.add("active");
    currentFilter = filter;
    renderCurrentFilter();
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
    //renderExpenses(expenses);
    renderCurrentFilter();
}

function updateExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);

    const newDescription = expenseDescriptionInput.value.trim();
    const newAmount = Number(amountInput.value);
    const newCategory = categoryInput.value;

    if (newDescription === "" || newAmount <= 0 || newCategory === "") {
        alert("Please provide some input");
        return false;
    }

    expense.description = newDescription;
    expense.amount = newAmount;
    expense.category = newCategory;

    saveExpenses(expenses);

    return true;
}

function renderExpense(expense) {
    const tableRow = document.createElement("tr");
    const id = document.createElement("td");
    const description = document.createElement("td");
    const amount = document.createElement("td");
    const categorySpan = document.createElement("span");
    const category = document.createElement("td");
    const Action = document.createElement("td");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");

    editButton.dataset.id = expense.id;
    deleteButton.dataset.id = expense.id;
    deleteButton.dataset.action = "delete";
    editButton.dataset.action = "edit";

    id.textContent = expense.id;
    description.textContent = expense.description;
    amount.textContent = expense.amount;
    categorySpan.textContent = expense.category;
    deleteButton.textContent = "🗑️";
    editButton.textContent = "✏️";
    Action.className = "action";
    deleteButton.className = "delete-row-btn";
    editButton.className = "edit-row-btn";

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
    Action.appendChild(editButton);
    Action.appendChild(deleteButton);
    tableRow.appendChild(Action);

    expenseTableBody.appendChild(tableRow);

    expenseDescriptionInput.value = "";
    amountInput.value = "";
}

function renderExpenses(expenseArray) {
    expenseTableBody.innerHTML = "";
    categoryInput.value = "select";
    totalBalance.textContent = calculateTotal(expenseArray);
    updateCategorySummary(expenseArray);
    if (expenseArray.length == 0) {
        emptyState.classList.remove("hidden");
        if (currentFilter === "all") {
            emptyState.textContent = `No expenses found`
        }
        else {
            emptyState.textContent = `No ${currentFilter} expenses found`
        }
        return;
    }

    emptyState.classList.add("hidden");
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

    return formatCurrency(amount);
}

function updateCategorySummary(expenseArray) {
    const categories = ["food", "transport", "entertainment", "other"];

    categories.forEach(function (category) {
        const totalAmount = calculateCategoryTotal(expenseArray, category);
        switch (category) {
            case "food":
                foodSummary.textContent = formatCurrency(totalAmount);
                break;
            case "transport":
                transportSummary.textContent = formatCurrency(totalAmount);
                break;
            case "entertainment":
                entertainmentSummary.textContent = formatCurrency(totalAmount);
                break;
            case "other":
                otherSummary.textContent = formatCurrency(totalAmount);
                break;
        }
    })
}

function calculateCategoryTotal(expenseArray, category) {
    const categoryArray = expenseArray.filter(function (expense) {
        return expense.category === category;
    })

    const totalAmount = categoryArray.reduce(function (count, expense) {
        return count + expense.amount;
    }, 0)

    return totalAmount;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function renderCurrentFilter() {
    if (currentFilter === "all") {
        renderExpenses(expenses);
    }
    else {
        renderExpenses(expenses.filter(function (expense) {
            return expense.category === currentFilter;
        }))
    }
}

function exitEditMode() {
    editingExpenseId = null;
    console.log("cancel button clicked");
    addExpenseButton.className = "addExpenseButton";
    addExpenseButton.querySelector("span").textContent = "+"
    addExpenseButton.querySelector(".btn-text").textContent = "Add Expense";
    cancelEditButton.classList.remove("is-visible");
}