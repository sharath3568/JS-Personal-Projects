import {
    getExpenses,
    getCategories,
    getSubcategories,
    createExpense,
    deleteExpense,
    createCategory,
    createSubcategory,
    deleteCategory,
    deleteSubcategory
} from "./expenses.js";


// ========================================
// PROJECT INFORMATION
// ========================================

const projectId =
    sessionStorage.getItem("selectedProjectId");

const projectName =
    sessionStorage.getItem("selectedProjectName");


if (!projectId) {
    window.location.href = "/index.html";
}


// ========================================
// ELEMENTS
// ========================================

const expenseMessage =
    document.querySelector("#expenseMessage");

const expensesList =
    document.querySelector("#expensesList");

const noExpensesMessage =
    document.querySelector("#noExpensesMessage");

const cancelExpenseButton =
    document.querySelector("#cancelExpenseButton");

const totalExpenses =
    document.querySelector("#totalExpenses");

const thisMonthTotal =
    document.querySelector("#thisMonthTotal");

const expenseCount =
    document.querySelector("#expenseCount");

const monthFilter =
    document.querySelector("#monthFilter");

const allExpensesButton =
    document.querySelector("#allExpensesButton");

const expenseFilterLabel =
    document.querySelector("#expenseFilterLabel");

const logoutButton =
    document.querySelector("#logoutButton");

const backButton =
    document.querySelector("#backButton");


// ========================================
// INITIALIZE PROJECT
// ========================================

async function initializeProject() {

    try {

        const currentProjectId =
            sessionStorage.getItem(
                "selectedProjectId"
            );

        const currentProjectName =
            sessionStorage.getItem(
                "selectedProjectName"
            );


        if (!currentProjectId) {

            window.location.href =
                "/index.html";

            return;
        }


        // ================================
        // PROJECT HEADER
        // ================================

        if (projectTitle) {

            projectTitle.textContent =
                currentProjectName ||
                "Expense Project";
        }


        if (projectDescription) {

            projectDescription.textContent =
                "Track your project expenses.";
        }


        // ================================
        // DEFAULT MONTH
        // ================================

        if (monthFilter) {

            const today =
                new Date();

            const year =
                today.getFullYear();

            const month =
                String(
                    today.getMonth() + 1
                ).padStart(2, "0");

            monthFilter.value =
                `${year}-${month}`;
        }


        // ================================
        // LOAD CATEGORIES
        // ================================

        await loadCategories();


        // ================================
        // LOAD EXPENSES
        // ================================

        await loadExpenses();


        // IMPORTANT:
        // loadExpenses() already calls
        // updateSummary().
        //
        // DO NOT call updateSummary()
        // again here.


    }
    catch (error) {

        console.error(
            "Project initialization failed:",
            error
        );

        if (expenseMessage) {

            expenseMessage.textContent =
                error.message;
        }
    }
}


// ========================================
// LOAD CATEGORIES
// ========================================

async function loadCategories() {

    try {

        const categories =
            await getCategories(projectId);


        expenseCategory.innerHTML = `
            <option value="">
                Select category
            </option>
        `;


        categories.forEach(category => {

            const option =
                document.createElement("option");

            option.value =
                category.id;

            option.textContent =
                category.name;

            expenseCategory.appendChild(
                option
            );
        });

    }
    catch (error) {

        console.error(
            "Unable to load categories:",
            error
        );

        expenseMessage.textContent =
            "Unable to load categories.";
    }
}

// ========================================
// CATEGORY MANAGEMENT ELEMENTS
// ========================================

const manageCategoriesButton =
    document.querySelector(
        "#manageCategoriesButton"
    );

const categoryManagementPanel =
    document.querySelector(
        "#categoryManagementPanel"
    );

const newCategoryName =
    document.querySelector(
        "#newCategoryName"
    );

const createCategoryButton =
    document.querySelector(
        "#createCategoryButton"
    );

const categoryManagementList =
    document.querySelector(
        "#categoryManagementList"
    );

const categoryMessage =
    document.querySelector(
        "#categoryMessage"
    );

// ========================================
// TOGGLE CATEGORY MANAGEMENT
// ========================================

manageCategoriesButton.addEventListener(
    "click",
    async () => {

        categoryManagementPanel
            .classList
            .toggle("hidden");

        if (
            !categoryManagementPanel
                .classList
                .contains("hidden")
        ) {

            await renderCategoryManagement();
        }
    }
);

// ========================================
// CREATE CATEGORY
// ========================================

createCategoryButton.addEventListener(
    "click",
    async () => {

        const name =
            newCategoryName.value.trim();


        if (!name) {

            categoryMessage.textContent =
                "Please enter a category name.";

            return;
        }


        createCategoryButton.disabled =
            true;


        categoryMessage.textContent =
            "Creating category...";


        try {

            await createCategory(
                projectId,
                name
            );


            newCategoryName.value = "";

            categoryMessage.textContent =
                "Category created.";


            await renderCategoryManagement();

            await loadCategories();

        }
        catch (error) {

            console.error(
                "Unable to create category:",
                error
            );

            categoryMessage.textContent =
                error.message;
        }
        finally {

            createCategoryButton.disabled =
                false;
        }
    }
);

// ========================================
// RENDER CATEGORY MANAGEMENT
// ========================================

async function renderCategoryManagement() {

    try {

        const categories =
            await getCategories(
                projectId
            );


        categoryManagementList.innerHTML = "";


        if (
            categories.length === 0
        ) {

            categoryManagementList.innerHTML = `
                <div class="category-empty">
                    No categories created yet.
                </div>
            `;

            return;
        }


        for (
            const category of categories
        ) {

            const subcategories =
                await getSubcategories(
                    category.id
                );


            const categoryElement =
                document.createElement(
                    "div"
                );


            categoryElement.className =
                "category-management-item";


            categoryElement.innerHTML = `

                <div class="category-header">

                    <div>

                        <strong>
                            ${escapeHtml(
                                category.name
                            )}
                        </strong>

                    </div>


                    <div class="category-actions">

                        <button
                            type="button"
                            class="add-subcategory-button"
                            data-category-id="${category.id}">

                            + Subcategory

                        </button>


                        <button
                            type="button"
                            class="delete-category-button"
                            data-category-id="${category.id}">

                            Delete

                        </button>

                    </div>

                </div>


                <div class="subcategory-list">

                    ${
                        subcategories.length === 0

                            ? `
                                <span class="no-subcategories">
                                    No subcategories
                                </span>
                              `

                            : subcategories
                                .map(
                                    subcategory => `
                                        <div
                                            class="subcategory-item">

                                            <span>
                                                ${escapeHtml(
                                                    subcategory.name
                                                )}
                                            </span>

                                            <button
                                                type="button"
                                                class="delete-subcategory-button"
                                                data-id="${subcategory.id}">

                                                ×

                                            </button>

                                        </div>
                                    `
                                )
                                .join("")
                    }

                </div>

            `;


            categoryManagementList.appendChild(
                categoryElement
            );
        }

    }
    catch (error) {

        console.error(
            "Unable to load categories:",
            error
        );

        categoryManagementList.innerHTML = `
            <div class="category-error">
                Unable to load categories.
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}

// ========================================
// CATEGORY MANAGEMENT CLICK HANDLER
// ========================================

categoryManagementList.addEventListener(
    "click",
    async event => {

        const addSubcategoryButton =
            event.target.closest(
                ".add-subcategory-button"
            );


        if (addSubcategoryButton) {

            const categoryId =
                addSubcategoryButton.dataset
                    .categoryId;


            const name =
                prompt(
                    "Enter subcategory name:"
                );


            if (!name || !name.trim()) {
                return;
            }


            try {

                await createSubcategory(
                    categoryId,
                    name.trim()
                );


                await renderCategoryManagement();

                await loadCategories();

            }
            catch (error) {

                console.error(
                    "Unable to create subcategory:",
                    error
                );

                alert(
                    error.message
                );
            }

            return;
        }


        // DELETE CATEGORY

        const deleteCategoryButton =
            event.target.closest(
                ".delete-category-button"
            );


        if (deleteCategoryButton) {

            const categoryId =
                deleteCategoryButton.dataset
                    .categoryId;


            const confirmed =
                confirm(
                    "Delete this category? Its subcategories may also be affected."
                );


            if (!confirmed) {
                return;
            }


            try {

                await deleteCategory(
                    categoryId
                );


                await renderCategoryManagement();

                await loadCategories();

            }
            catch (error) {

                console.error(
                    "Unable to delete category:",
                    error
                );

                alert(
                    error.message
                );
            }

            return;
        }


        // DELETE SUBCATEGORY

        const deleteSubcategoryButton =
            event.target.closest(
                ".delete-subcategory-button"
            );


        if (deleteSubcategoryButton) {

            const subcategoryId =
                deleteSubcategoryButton.dataset.id;


            const confirmed =
                confirm(
                    "Delete this subcategory?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await deleteSubcategory(
                    subcategoryId
                );


                await renderCategoryManagement();

                await loadCategories();

            }
            catch (error) {

                console.error(
                    "Unable to delete subcategory:",
                    error
                );

                alert(
                    error.message
                );
            }
        }
    }
);


// ========================================
// CATEGORY CHANGE
// ========================================

expenseCategory.addEventListener(
    "change",
    async () => {

        const categoryId =
            expenseCategory.value;


        expenseSubcategory.innerHTML = `
            <option value="">
                Select subcategory
            </option>
        `;


        if (!categoryId) {
            return;
        }


        try {

            const subcategories =
                await getSubcategories(
                    categoryId
                );


            subcategories.forEach(
                subcategory => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        subcategory.id;

                    option.textContent =
                        subcategory.name;

                    expenseSubcategory
                        .appendChild(option);
                }
            );

        }
        catch (error) {

            console.error(
                "Unable to load subcategories:",
                error
            );
        }
    }
);


// ========================================
// LOAD EXPENSES
// ========================================

async function loadExpenses() {

    try {

        const expenses =
            await getExpenses(
                projectId
            );


        updateSummary(
            expenses
        );


        renderExpenses(
            expenses
        );

    }
    catch (error) {

        console.error(
            "Unable to load expenses:",
            error
        );

        expensesList.innerHTML = `
            <div class="expense-error">
                Unable to load expenses.
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}


// ========================================
// SUMMARY
// ========================================

function updateSummary(expenses) {

    // Make sure we always have an array
    if (!Array.isArray(expenses)) {
        expenses = [];
    }


    // ================================
    // TOTAL EXPENSES
    // ================================

    const total =
        expenses.reduce(
            (sum, expense) => {

                return sum +
                    Number(
                        expense.amount || 0
                    );

            },
            0
        );


    // ================================
    // EXPENSE COUNT
    // ================================

    if (expenseCount) {

        expenseCount.textContent =
            expenses.length;
    }


    // ================================
    // TOTAL
    // ================================

    if (totalExpenses) {

        totalExpenses.textContent =
            formatCurrency(total);
    }


    // ================================
    // CURRENT MONTH
    // ================================

    const now =
        new Date();

    const currentYear =
        now.getFullYear();

    const currentMonth =
        now.getMonth();


    const currentMonthTotal =
        expenses.reduce(
            (sum, expense) => {

                const date =
                    new Date(
                        expense.expense_date
                    );


                if (
                    date.getFullYear() ===
                        currentYear &&
                    date.getMonth() ===
                        currentMonth
                ) {

                    return sum +
                        Number(
                            expense.amount || 0
                        );
                }


                return sum;

            },
            0
        );


    // ================================
    // THIS MONTH DISPLAY
    // ================================

    if (thisMonthTotal) {

        thisMonthTotal.textContent =
            formatCurrency(
                currentMonthTotal
            );
    }
}


// ========================================
// RENDER EXPENSES
// ========================================

function renderExpenses(expenses) {

    let filteredExpenses =
        expenses;


    // Month filtering

    if (
        monthFilter &&
        monthFilter.value
    ) {

        const [
            year,
            month
        ] =
            monthFilter.value
                .split("-")
                .map(Number);


        filteredExpenses =
            expenses.filter(
                expense => {

                    const date =
                        new Date(
                            expense.expense_date
                        );


                    return (
                        date.getFullYear() ===
                            year &&
                        date.getMonth() + 1 ===
                            month
                    );
                }
            );
    }


    if (
    filteredExpenses.length === 0
) {

    expensesList.innerHTML = "";

    if (noExpensesMessage) {

        noExpensesMessage.classList.remove(
            "hidden"
        );
    }

    return;
}


if (noExpensesMessage) {

    noExpensesMessage.classList.add(
        "hidden"
    );
}


expensesList.innerHTML = "";


    filteredExpenses.forEach(
        expense => {

            const row =
                document.createElement("div");

            row.className =
                "expense-row";


            const categoryName =
                expense.categories?.name ||
                "Uncategorized";


            const subcategoryName =
                expense.subcategories?.name ||
                "";


            row.innerHTML = `

                <div class="expense-main">

                    <div class="expense-category-icon">
                        ₹
                    </div>

                    <div>

                        <div class="expense-title">
                            ${escapeHtml(
                                expense.description ||
                                categoryName
                            )}
                        </div>

                        <div class="expense-details">

                            ${escapeHtml(
                                categoryName
                            )}

                            ${
                                subcategoryName
                                    ? " • " +
                                      escapeHtml(
                                          subcategoryName
                                      )
                                    : ""
                            }

                            •
                            ${formatDate(
                                expense.expense_date
                            )}

                        </div>

                    </div>

                </div>


                <div class="expense-right">

                    <div class="expense-amount">
                        ${formatCurrency(
                            expense.amount
                        )}
                    </div>

                    <button
                        type="button"
                        class="delete-expense-button"
                        data-id="${expense.id}">
                        Delete
                    </button>

                </div>

            `;


            const deleteButton =
                row.querySelector(
                    ".delete-expense-button"
                );


            deleteButton.addEventListener(
                "click",
                async () => {

                    await handleDeleteExpense(
                        expense.id
                    );
                }
            );


            expensesList.appendChild(
                row
            );
        }
    );
}


// ========================================
// ADD EXPENSE BUTTON
// ========================================

addExpenseButton.addEventListener(
    "click",
    () => {

        expenseFormCard.classList.remove(
            "hidden"
        );

        expenseDate.focus();
    }
);


// ========================================
// CANCEL EXPENSE
// ========================================

cancelExpenseButton.addEventListener(
    "click",
    () => {

        expenseForm.reset();

        expenseMessage.textContent = "";

        expenseSubcategory.innerHTML = `
            <option value="">
                Select subcategory
            </option>
        `;


        // Reset date

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        expenseDate.value =
            today;


        expenseFormCard.classList.add(
            "hidden"
        );
    }
);


// ========================================
// SAVE EXPENSE
// ========================================

expenseForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const date =
            expenseDate.value;

        const amount =
            expenseAmount.value;

        const categoryId =
            expenseCategory.value;

        const subcategoryId =
            expenseSubcategory.value;

        const description =
            expenseDescription.value.trim();


        if (!date) {

            expenseMessage.textContent =
                "Please select a date.";

            return;
        }


        if (
            !amount ||
            Number(amount) <= 0
        ) {

            expenseMessage.textContent =
                "Please enter a valid amount.";

            return;
        }


        if (!categoryId) {

            expenseMessage.textContent =
                "Please select a category.";

            return;
        }


        const saveButton =
            expenseForm.querySelector(
                'button[type="submit"]'
            );


        saveButton.disabled =
            true;


        expenseMessage.textContent =
            "Saving expense...";


        try {

            await createExpense(

                projectId,

                date,

                amount,

                categoryId,

                subcategoryId,

                description
            );


            expenseForm.reset();


            expenseSubcategory.innerHTML = `
                <option value="">
                    Select subcategory
                </option>
            `;


            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];


            expenseDate.value =
                today;


            expenseMessage.textContent =
                "";


            expenseFormCard.classList.add(
                "hidden"
            );


            await loadExpenses();

        }
        catch (error) {

            console.error(
                "Unable to create expense:",
                error
            );

            expenseMessage.textContent =
                error.message;
        }
        finally {

            saveButton.disabled =
                false;
        }
    }
);


// ========================================
// DELETE EXPENSE
// ========================================

async function handleDeleteExpense(
    expenseId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteExpense(
            expenseId
        );


        await loadExpenses();

    }
    catch (error) {

        console.error(
            "Unable to delete expense:",
            error
        );

        alert(
            "Unable to delete expense: " +
            error.message
        );
    }
}


// ========================================
// MONTH FILTER
// ========================================

monthFilter.addEventListener(
    "change",
    async () => {

        await loadExpenses();
    }
);


// ========================================
// ALL EXPENSES
// ========================================

allExpensesButton.addEventListener(
    "click",
    async () => {

        monthFilter.value = "";

        await loadExpenses();
    }
);


// ========================================
// BACK
// ========================================

backButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "/index.html";
    }
);


// ========================================
// HELPERS
// ========================================

function formatCurrency(amount) {

    return Number(amount || 0)
        .toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2
            }
        );
}


function formatDate(date) {

    if (!date) {
        return "";
    }


    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
}


function escapeHtml(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


// ========================================
// START
// ========================================

initializeProject();