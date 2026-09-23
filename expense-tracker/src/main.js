import {
    signUp,
    signIn,
    signOut,
    getCurrentUser
} from "./auth.js";

import {
    getProjects,
    createProject
} from "./projects.js";

import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getCategories,
    getSubcategories
} from "./expenses.js";


// ========================================
// AUTH ELEMENTS
// ========================================

const authPage =
    document.querySelector("#authPage");

const projectsPage =
    document.querySelector("#projectsPage");

const loginTab =
    document.querySelector("#loginTab");

const signupTab =
    document.querySelector("#signupTab");

const loginForm =
    document.querySelector("#login-form");

const signupForm =
    document.querySelector("#signup-form");

const loginMessage =
    document.querySelector("#login-message");

const signupMessage =
    document.querySelector("#signup-message");


// ========================================
// PROJECT ELEMENTS
// ========================================

const userEmail =
    document.querySelector("#userEmail");

const logoutButton =
    document.querySelector("#logoutButton");

const newProjectButton =
    document.querySelector("#newProjectButton");

const projectFormCard =
    document.querySelector("#projectFormCard");

const projectForm =
    document.querySelector("#projectForm");

const cancelProjectButton =
    document.querySelector("#cancelProjectButton");

const projectName =
    document.querySelector("#projectName");

const projectDescription =
    document.querySelector("#projectDescription");

const projectMessage =
    document.querySelector("#projectMessage");

const projectsGrid =
    document.querySelector("#projectsGrid");

const noProjectsMessage =
    document.querySelector("#noProjectsMessage");

// ========================================
// PROJECT DETAIL ELEMENTS
// ========================================

const projectDetailPage =
    document.querySelector("#projectDetailPage");

const backToProjectsButton =
    document.querySelector("#backToProjectsButton");

const detailLogoutButton =
    document.querySelector("#detailLogoutButton");

const detailProjectName =
    document.querySelector("#detailProjectName");

const detailProjectDescription =
    document.querySelector("#detailProjectDescription");

const addExpenseButton =
    document.querySelector("#addExpenseButton");

const totalExpenseAmount =
    document.querySelector("#totalExpenseAmount");

const monthExpenseAmount =
    document.querySelector("#monthExpenseAmount");

const expenseCount =
    document.querySelector("#expenseCount");

const expenseMonth =
    document.querySelector("#expenseMonth");

const clearMonthButton =
    document.querySelector("#clearMonthButton");

const expenseFormCard =
    document.querySelector("#expenseFormCard");

const expenseForm =
    document.querySelector("#expenseForm");

const expenseFormTitle =
    document.querySelector("#expenseFormTitle");

const cancelExpenseButton =
    document.querySelector("#cancelExpenseButton");

const expenseId =
    document.querySelector("#expenseId");

const expenseDate =
    document.querySelector("#expenseDate");

const expenseAmount =
    document.querySelector("#expenseAmount");

const expenseCategory =
    document.querySelector("#expenseCategory");

const expenseSubcategory =
    document.querySelector("#expenseSubcategory");

const expenseDescription =
    document.querySelector("#expenseDescription");

const expenseMessage =
    document.querySelector("#expenseMessage");

const saveExpenseButton =
    document.querySelector("#saveExpenseButton");

const expensesContainer =
    document.querySelector("#expensesContainer");

const noExpensesMessage =
    document.querySelector("#noExpensesMessage");

const expensePeriodLabel =
    document.querySelector("#expensePeriodLabel");

let currentProject = null;
let currentExpenses = [];

// ========================================
// AUTH UI
// ========================================

function showLogin() {

    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");

    loginMessage.textContent = "";
    signupMessage.textContent = "";
}


function showSignup() {

    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    loginMessage.textContent = "";
    signupMessage.textContent = "";
}


loginTab.addEventListener(
    "click",
    showLogin
);

signupTab.addEventListener(
    "click",
    showSignup
);


// ========================================
// SHOW PROJECT PAGE
// ========================================

async function showProjectsPage(user) {

    authPage.classList.add("hidden");

    projectsPage.classList.remove("hidden");

    userEmail.textContent =
        user.email || "";

    await loadProjects();
}


// ========================================
// SHOW LOGIN PAGE
// ========================================

function showAuthPage() {

    projectsPage.classList.add("hidden");

    authPage.classList.remove("hidden");
}


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            document.querySelector("#login-email")
                .value
                .trim();

        const password =
            document.querySelector("#login-password")
                .value;


        loginMessage.textContent =
            "Signing in...";


        try {

            const data =
                await signIn(
                    email,
                    password
                );


            loginMessage.textContent = "";


            await showProjectsPage(
                data.user
            );

        }
        catch (error) {

            console.error(error);

            loginMessage.textContent =
                error.message;
        }
    }
);


// ========================================
// SIGNUP
// ========================================

signupForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const name =
            document.querySelector("#signup-name")
                .value
                .trim();

        const email =
            document.querySelector("#signup-email")
                .value
                .trim();

        const password =
            document.querySelector("#signup-password")
                .value;


        signupMessage.textContent =
            "Creating your account...";


        try {

            const data =
                await signUp(
                    email,
                    password,
                    name
                );


            if (data.session) {

                signupMessage.textContent =
                    "Account created.";

                await showProjectsPage(
                    data.user
                );

            }
            else {

                signupMessage.textContent =
                    "Account created. Please confirm your email before signing in.";

            }

        }
        catch (error) {

            console.error(error);

            signupMessage.textContent =
                error.message;
        }
    }
);


// ========================================
// LOGOUT
// ========================================

logoutButton.addEventListener(
    "click",
    async () => {

        try {

            await signOut();

            showAuthPage();

            showLogin();

        }
        catch (error) {

            console.error(error);

            alert(error.message);
        }
    }
);


// ========================================
// NEW PROJECT FORM
// ========================================

newProjectButton.addEventListener(
    "click",
    () => {

        projectFormCard.classList.remove(
            "hidden"
        );

        projectName.focus();

    }
);


cancelProjectButton.addEventListener(
    "click",
    () => {

        projectForm.reset();

        projectMessage.textContent = "";

        projectFormCard.classList.add(
            "hidden"
        );
    }
);


// ========================================
// CREATE PROJECT
// ========================================

projectForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            projectName.value.trim();

        const description =
            projectDescription.value.trim();


        if (!name) {

            projectMessage.textContent =
                "Project name is required.";

            return;
        }


        const button =
            document.querySelector(
                "#createProjectButton"
            );


        button.disabled = true;

        projectMessage.textContent =
            "Creating project...";


        try {

            await createProject(
                name,
                description
            );


            projectForm.reset();

            projectMessage.textContent = "";

            projectFormCard.classList.add(
                "hidden"
            );


            await loadProjects();

        }
        catch (error) {

            console.error(error);

            projectMessage.textContent =
                error.message;
        }
        finally {

            button.disabled = false;
        }
    }
);


// ========================================
// LOAD PROJECTS
// ========================================

async function loadProjects() {

    projectsGrid.innerHTML = "";

    noProjectsMessage.classList.add(
        "hidden"
    );


    try {

        const projects =
            await getProjects();


        if (!projects || projects.length === 0) {

            noProjectsMessage.classList.remove(
                "hidden"
            );

            return;
        }


        projects.forEach(
            renderProject
        );

    }
    catch (error) {

        console.error(
            "Unable to load projects:",
            error
        );

        projectsGrid.innerHTML = `
            <p>
                Unable to load projects:
                ${error.message}
            </p>
        `;
    }
}


// ========================================
// RENDER PROJECT
// ========================================

function renderProject(project) {

    const card =
        document.createElement("div");


    card.className =
        "project-card";


    card.innerHTML = `

        <div class="project-icon">
            🏠
        </div>

        <h3>
            ${escapeHtml(project.name)}
        </h3>

        <p>
            ${escapeHtml(
                project.description ||
                "No description"
            )}
        </p>

        <div class="project-meta">
            Created:
            ${formatDate(project.created_at)}
        </div>

    `;


card.addEventListener(
    "click",
    () => {

        sessionStorage.setItem(
            "selectedProjectId",
            project.id
        );

        sessionStorage.setItem(
            "selectedProjectName",
            project.name
        );

        window.location.href =
            "/project.html";
    }
);


    projectsGrid.appendChild(card);
}


// ========================================
// HELPERS
// ========================================

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
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ========================================
// INITIALIZE APPLICATION
// ========================================

async function initializeApp() {

    try {

        const user =
            await getCurrentUser();


        if (user) {

            await showProjectsPage(
                user
            );

        }
        else {

            showAuthPage();

        }

    }
    catch (error) {

        console.error(
            "Application initialization failed:",
            error
        );

        showAuthPage();
    }
}

// ========================================
// OPEN PROJECT
// ========================================

async function openProject(project) {

    currentProject = project;


    projectsPage.classList.add("hidden");

    projectDetailPage.classList.remove("hidden");


    detailProjectName.textContent =
        project.name;

    detailProjectDescription.textContent =
        project.description ||
        "Expense project";


    expenseFormCard.classList.add("hidden");


    await loadCategories();

    await loadProjectExpenses();
}

// ========================================
// BACK TO PROJECTS
// ========================================

backToProjectsButton.addEventListener(
    "click",
    () => {

        projectDetailPage.classList.add(
            "hidden"
        );

        projectsPage.classList.remove(
            "hidden"
        );

        currentProject = null;
    }
);

// ========================================
// LOAD PROJECT EXPENSES
// ========================================

async function loadProjectExpenses() {

    if (!currentProject) {
        return;
    }


    expensesContainer.innerHTML = "";

    noExpensesMessage.classList.add(
        "hidden"
    );


    const month =
        expenseMonth.value || null;


    try {

        currentExpenses =
            await getExpenses(
                currentProject.id,
                month
            );


        renderExpenseSummary(
            currentExpenses
        );

        renderExpenses(
            currentExpenses
        );


        if (month) {

            const date =
                new Date(`${month}-01`);

            expensePeriodLabel.textContent =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        month: "long",
                        year: "numeric"
                    }
                );

        }
        else {

            expensePeriodLabel.textContent =
                "All expenses";

        }


        if (
            !currentExpenses ||
            currentExpenses.length === 0
        ) {

            noExpensesMessage.classList.remove(
                "hidden"
            );
        }

    }
    catch (error) {

        console.error(error);

        expensesContainer.innerHTML = `
            <div class="error-box">
                Unable to load expenses:
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}

// ========================================
// EXPENSE SUMMARY
// ========================================

function renderExpenseSummary(expenses) {

    const total =
        expenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount || 0),
            0
        );


    totalExpenseAmount.textContent =
        formatCurrency(total);


    expenseCount.textContent =
        expenses.length;


    const currentMonth =
        new Date().toISOString().slice(0, 7);


    const currentMonthExpenses =
        expenses.filter(
            expense =>
                expense.expense_date &&
                expense.expense_date.startsWith(
                    currentMonth
                )
        );


    const monthTotal =
        currentMonthExpenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount || 0),
            0
        );


    monthExpenseAmount.textContent =
        formatCurrency(monthTotal);
}

// ========================================
// RENDER EXPENSES
// ========================================

function renderExpenses(expenses) {

    expensesContainer.innerHTML = "";


    expenses.forEach(
        expense => {

            const row =
                document.createElement("div");


            row.className =
                "expense-row";


            const category =
                expense.categories?.name ||
                "Uncategorized";


            const subcategory =
                expense.subcategories?.name ||
                "";


            row.innerHTML = `

                <div class="expense-date">

                    <strong>
                        ${formatExpenseDate(
                            expense.expense_date
                        )}
                    </strong>

                </div>


                <div class="expense-main">

                    <strong>
                        ${escapeHtml(
                            category
                        )}
                    </strong>

                    ${
                        subcategory
                            ? `
                                <span>
                                    ${escapeHtml(
                                        subcategory
                                    )}
                                </span>
                              `
                            : ""
                    }

                    ${
                        expense.description
                            ? `
                                <small>
                                    ${escapeHtml(
                                        expense.description
                                    )}
                                </small>
                              `
                            : ""
                    }

                </div>


                <div class="expense-amount">

                    ${formatCurrency(
                        expense.amount
                    )}

                </div>


                <div class="expense-actions">

                    <button
                        type="button"
                        class="expense-edit"
                        data-id="${expense.id}">
                        Edit
                    </button>

                    <button
                        type="button"
                        class="expense-delete"
                        data-id="${expense.id}">
                        Delete
                    </button>

                </div>

            `;


            row.querySelector(
                ".expense-edit"
            ).addEventListener(
                "click",
                () => editExpense(expense)
            );


            row.querySelector(
                ".expense-delete"
            ).addEventListener(
                "click",
                () => removeExpense(expense)
            );


            expensesContainer.appendChild(row);
        }
    );
}

// ========================================
// LOAD CATEGORIES
// ========================================

async function loadCategories() {

    try {

        const categories =
            await getCategories();


        expenseCategory.innerHTML = `
            <option value="">
                Select category
            </option>
        `;


        categories.forEach(
            category => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category.id;

                option.textContent =
                    category.name;

                expenseCategory.appendChild(
                    option
                );
            }
        );

    }
    catch (error) {

        console.error(
            "Unable to load categories:",
            error
        );
    }
}

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

                    expenseSubcategory.appendChild(
                        option
                    );
                }
            );

        }
        catch (error) {

            console.error(error);
        }
    }
);

addExpenseButton.addEventListener(
    "click",
    () => {

        expenseForm.reset();

        expenseId.value = "";

        expenseFormTitle.textContent =
            "Add Expense";

        saveExpenseButton.textContent =
            "Save Expense";


        expenseDate.value =
            new Date()
                .toISOString()
                .slice(0, 10);


        expenseFormCard.classList.remove(
            "hidden"
        );


        expenseDate.focus();
    }
);

cancelExpenseButton.addEventListener(
    "click",
    () => {

        expenseForm.reset();

        expenseId.value = "";

        expenseMessage.textContent = "";

        expenseFormCard.classList.add(
            "hidden"
        );
    }
);

expenseForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!currentProject) {
            return;
        }


        const data = {

            project_id:
                currentProject.id,

            category_id:
                expenseCategory.value || null,

            subcategory_id:
                expenseSubcategory.value || null,

            amount:
                Number(
                    expenseAmount.value
                ),

            description:
                expenseDescription.value.trim() ||
                null,

            expense_date:
                expenseDate.value
        };


        saveExpenseButton.disabled =
            true;


        expenseMessage.textContent =
            "Saving...";


        try {

            if (expenseId.value) {

                await updateExpense(
                    expenseId.value,
                    data
                );

            }
            else {

                await createExpense(
                    data
                );
            }


            expenseForm.reset();

            expenseId.value = "";

            expenseFormCard.classList.add(
                "hidden"
            );


            await loadProjectExpenses();

        }
        catch (error) {

            console.error(error);

            expenseMessage.textContent =
                error.message;
        }
        finally {

            saveExpenseButton.disabled =
                false;
        }
    }
);

async function editExpense(expense) {

    expenseId.value =
        expense.id;

    expenseDate.value =
        expense.expense_date || "";

    expenseAmount.value =
        expense.amount;

    expenseDescription.value =
        expense.description || "";


    expenseCategory.value =
        expense.category_id || "";


    if (expense.category_id) {

        const subcategories =
            await getSubcategories(
                expense.category_id
            );


        expenseSubcategory.innerHTML = `
            <option value="">
                Select subcategory
            </option>
        `;


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

                expenseSubcategory.appendChild(
                    option
                );
            }
        );


        expenseSubcategory.value =
            expense.subcategory_id || "";
    }


    expenseFormTitle.textContent =
        "Edit Expense";


    saveExpenseButton.textContent =
        "Update Expense";


    expenseFormCard.classList.remove(
        "hidden"
    );


    expenseFormCard.scrollIntoView({
        behavior: "smooth"
    });
}

async function removeExpense(expense) {

    const confirmed =
        confirm(
            `Delete this expense of ${formatCurrency(
                expense.amount
            )}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteExpense(
            expense.id
        );


        await loadProjectExpenses();

    }
    catch (error) {

        console.error(error);

        alert(
            "Unable to delete expense: " +
            error.message
        );
    }
}

expenseMonth.addEventListener(
    "change",
    async () => {

        await loadProjectExpenses();

    }
);


clearMonthButton.addEventListener(
    "click",
    async () => {

        expenseMonth.value = "";

        await loadProjectExpenses();

    }
);

function formatCurrency(value) {

    return Number(value || 0)
        .toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        );
}


function formatExpenseDate(date) {

    if (!date) {
        return "";
    }


    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
}


initializeApp();