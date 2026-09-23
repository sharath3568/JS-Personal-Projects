import { supabase } from "./supabase.js";


// ========================================
// GET CURRENT USER
// ========================================

async function getCurrentUser() {

    const {
        data,
        error
    } = await supabase.auth.getUser();

    if (error) {
        throw error;
    }

    return data.user;
}


// ========================================
// GET PROJECT EXPENSES
// ========================================

export async function getExpenses(projectId) {

    const {
        data,
        error
    } = await supabase
        .from("expenses")
        .select(`
            *,
            categories (
                id,
                name
            ),
            subcategories (
                id,
                name
            )
        `)
        .eq("project_id", projectId)
        .order("expense_date", {
            ascending: false
        })
        .order("created_at", {
            ascending: false
        });

    if (error) {
        throw error;
    }

    return data || [];
}


// ========================================
// GET CATEGORIES
// ========================================

export async function getCategories(projectId) {

    const {
        data,
        error
    } = await supabase
        .from("categories")
        .select("*")
        .eq("project_id", projectId)
        .order("name");

    if (error) {
        throw error;
    }

    return data || [];
}


// ========================================
// GET SUBCATEGORIES
// ========================================

export async function getSubcategories(categoryId) {

    const {
        data,
        error
    } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", categoryId)
        .order("name");

    if (error) {
        throw error;
    }

    return data || [];
}

// ========================================
// CREATE CATEGORY
// ========================================

export async function createCategory(
    projectId,
    name
) {

    const {
        data,
        error
    } = await supabase
        .from("categories")
        .insert({
            project_id: projectId,
            name: name.trim()
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}


// ========================================
// CREATE SUBCATEGORY
// ========================================

export async function createSubcategory(
    categoryId,
    name
) {

    const {
        data,
        error
    } = await supabase
        .from("subcategories")
        .insert({
            category_id: categoryId,
            name: name.trim()
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}


// ========================================
// DELETE CATEGORY
// ========================================

export async function deleteCategory(
    categoryId
) {

    const {
        error
    } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

    if (error) {
        throw error;
    }
}


// ========================================
// DELETE SUBCATEGORY
// ========================================

export async function deleteSubcategory(
    subcategoryId
) {

    const {
        error
    } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", subcategoryId);

    if (error) {
        throw error;
    }
}


// ========================================
// CREATE EXPENSE
// ========================================

export async function createExpense(
    projectId,
    expenseDate,
    amount,
    categoryId,
    subcategoryId,
    description
) {

    const user = await getCurrentUser();

    if (!user) {
        throw new Error("You must be logged in.");
    }

    const {
        data,
        error
    } = await supabase
        .from("expenses")
        .insert({

            project_id: projectId,

            expense_date: expenseDate,

            amount: Number(amount),

            category_id: categoryId,

            subcategory_id:
                subcategoryId || null,

            description:
                description || null,

            created_by: user.id
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}


// ========================================
// UPDATE EXPENSE
// ========================================

export async function updateExpense(
    expenseId,
    expenseDate,
    amount,
    categoryId,
    subcategoryId,
    description
) {

    const {
        data,
        error
    } = await supabase
        .from("expenses")
        .update({

            expense_date: expenseDate,

            amount: Number(amount),

            category_id: categoryId,

            subcategory_id:
                subcategoryId || null,

            description:
                description || null,

            updated_at: new Date().toISOString()

        })
        .eq("id", expenseId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}


// ========================================
// DELETE EXPENSE
// ========================================

export async function deleteExpense(expenseId) {

    const {
        error
    } = await supabase
        .from("expenses")
        .delete()
        .eq("id", expenseId);

    if (error) {
        throw error;
    }
}