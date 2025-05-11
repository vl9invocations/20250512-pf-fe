import React, { createContext, useState, useContext, useCallback } from "react";
import { apiCommunicationServices } from "../services/apiCommunicationServices";
import type { Participant } from "../types/Participant";

interface ParticipantContext {
    participants: Participant[];
    loading: boolean;
    error: string | null;
    getParticipants: () => Promise<void>;
    addParticipant: (participant: Omit<Participant, "id">) => Promise<void>;
    deleteParticipants: (ids: number[]) => Promise<void>;
    editParticipant: (id: number | undefined, updatedData: Omit<Participant, "id">) => Promise<void>;
}

const ParticipantContext = createContext<ParticipantContext | undefined>(undefined);

export const ParticipantContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getParticipants = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiCommunicationServices.getParticipants();
            setParticipants(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    const addParticipant = useCallback(async (participant: Omit<Participant, "id">) => {
        setLoading(true);
        setError(null);
        try {
            await apiCommunicationServices.addParticipant(participant);
            await getParticipants();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [getParticipants]);

    const deleteParticipants = useCallback(async (ids: number[]) => {
        setLoading(true);
        setError(null);
        try {
            await apiCommunicationServices.deleteParticipants(ids);
            await getParticipants();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [getParticipants]);

    const editParticipant = useCallback(
        async (id: number | undefined, updatedData: Omit<Participant, "id">) => {
            if (id === undefined) {
                setError("Participant ID is undefined");
                return;
            }
            setLoading(true);
            setError(null);
            try {
                await apiCommunicationServices.editParticipant(id, updatedData);
                await getParticipants();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        },
        [getParticipants]
    );

    return (
        <ParticipantContext.Provider
            value={{
                participants,
                loading,
                error,
                getParticipants,
                addParticipant,
                deleteParticipants,
                editParticipant,
            }}
        >
            {children}
        </ParticipantContext.Provider>
    );
};

export const useParticipantContext = (): ParticipantContext => {
    const context = useContext(ParticipantContext);
    if (!context) {
        throw new Error("useParticipantContext must be used within a ParticipantContextProvider");
    }
    return context;
};