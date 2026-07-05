import API_BASE from "./api";

export async function askQuestion(
    datasetId: number,
    question: string,
    token: string
) {

    const response = await fetch(`${API_BASE}/data/analyze`, {

        method:"POST",

        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        },

        body: JSON.stringify({
            dataset_id: datasetId,
            question
        })
    });

    return response.json();
}