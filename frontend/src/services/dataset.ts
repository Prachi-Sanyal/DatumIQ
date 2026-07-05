import API_BASE from "./api";

export async function uploadDataset(file: File, token: string) {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`${API_BASE}/data/upload`, {

        method: "POST",

        headers: {
            Authorization: `Bearer ${token}`
        },

        body: formData
    });

    return response.json();
}