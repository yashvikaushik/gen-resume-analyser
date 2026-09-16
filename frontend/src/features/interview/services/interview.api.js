import api from "../../auth/services/auth.api";

/**
 * Generate an AI interview report by uploading PDF resume and text descriptions
 * @param {FormData} formData
 */
export async function generateReportApi(formData) {
    const response = await api.post("/api/interview/generate", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

/**
 * Fetch a single interview report by its MongoDB ID
 * @param {string} id
 */
export async function getReportByIdApi(id) {
    const response = await api.get(`/api/interview/${id}`);
    return response.data;
}

/**
 * Fetch all past reports for the authenticated user
 */
export async function getUserReportsApi() {
    const response = await api.get("/api/interview/user/history");
    return response.data;
}
