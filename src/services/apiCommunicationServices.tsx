import type { Participant } from "../types/Participant";

import axios from "axios";
import type { ParticipantsResponse } from "../types/Participant";

const apiUrl: string | undefined = import.meta.env.VITE_API_URL;

export const apiCommunicationServices = {
    getParticipants: async (): Promise<Participant[]> => {
        const response = await axios.get<ParticipantsResponse>(`${apiUrl}/participants`, {
            headers: { "Content-Type": "application/json" },
        });
        if (!response.data.data) {
            return [];
            // ! practically this is not an error, but we can handle it in the UI
            // ! if there is no data, we can return an empty array
            // throw new Error(response.data.message || "Failed to fetch participants");
        }
        return response.data.data;
    },

    editParticipant: async (id: number, updatedParticipant: Omit<Participant, "id">): Promise<Participant> => {
        const response = await axios.put(`${apiUrl}/participants/${id}`, updatedParticipant, {
            headers: { "Content-Type": "application/json" },
        });
        if (!response.data.data) {
            throw new Error(response.data.message || "Failed to edit participant");
        }
        return response.data.data;
    },

    addParticipant: async (newParticipant: Omit<Participant, "id">): Promise<Participant> => {
        const response = await axios.post(`${apiUrl}/participants`, newParticipant, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data.data;
    },

    deleteParticipants: async (ids: number[]): Promise<void> => {
        await Promise.all(
            ids.map((id) =>
                axios.delete(`${apiUrl}/participants/${id}`, {
                    headers: { "Content-Type": "application/json" },
                })
            )
        );
    },
};