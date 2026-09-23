import { supabase } from "./supabase.js";


// ========================================
// GET PROJECTS
// ========================================

export async function getProjects() {

    const {
        data,
        error
    } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {
        throw error;
    }

    return data || [];
}


// ========================================
// CREATE PROJECT
// ========================================

export async function createProject(
    name,
    description
) {

    const {
        data,
        error
    } = await supabase.rpc(
        "create_project",
        {
            p_name: name,
            p_description: description || null
        }
    );

    if (error) {
        throw error;
    }

    return data;
}