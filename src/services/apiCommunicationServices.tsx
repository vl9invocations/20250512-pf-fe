import type React from "react";
import type { Participant, ParticipantsResponse } from "../types/Participant";
import axios from "axios";

const apiUrl: string | undefined = import.meta.env.VITE_API_URL;

export const apiCommunicationServices = {
    // * ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   
    // * Getting a list of participants logic
    // *

    getParticipants: async (setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>) => {
        axios.get<ParticipantsResponse>(apiUrl + '/participants', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.data.data == null) {
                    console.error('Error fetching participants:', response.data.message);
                    return;
                }
                setParticipants(response.data.data);
                // console.log("Checked participants:");
            })
            .catch((error) => {
                console.error('Error fetching participants:', error);
            });
    },

    // * ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   
    // * Adding a new participant logic
    // *
    addParticipant: async (setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>) => {
        // event.preventDefault();
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const emailInput = document.getElementById('email') as HTMLInputElement;
        const birthdateInput = document.getElementById('birthdate') as HTMLInputElement;
        const name = nameInput.value;
        const email = emailInput.value;
        const birthdate = birthdateInput.value;
        const newParticipant = {
            name,
            email,
            birthdate
        };
        axios.post(apiUrl + '/participants', newParticipant, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                apiCommunicationServices.getParticipants(setParticipants);
                nameInput.value = '';
                emailInput.value = '';
                birthdateInput.value = '';
            })
            .catch((error) => {
                console.error('Error adding participant:', error);
            });
    },
    // * ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   
    // * Editing a participant logic
    // *
    enableEditingParticipant: (id: number,
        editingParticipant: number[],
        setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>,
        setEditingParticipant: React.Dispatch<React.SetStateAction<number[]>>,
    ) => {
        setEditingParticipant((prev) => {
            if (prev.includes(id)) {
                return prev.filter((editingParticipant) => editingParticipant !== id);
            } else {
                return [...prev, id];
            }
        });

        if (editingParticipant.includes(id)) {
            const nameInput = document.getElementById('edited-name') as HTMLInputElement;
            const emailInput = document.getElementById('edited-email') as HTMLInputElement;
            const birthdateInput = document.getElementById('edited-birthdate') as HTMLInputElement;
            const name = nameInput.value;
            const email = emailInput.value;
            const birthdate = birthdateInput.value;
            const updatedParticipant = {
                name,
                email,
                birthdate
            };
            axios.put(apiUrl + `/participants/${id}`, updatedParticipant, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    // console.log(response.data);
                    apiCommunicationServices.getParticipants(setParticipants);
                })
                .catch((error) => {
                    console.error('Error updating participant:', error);
                });
        }
    },


    // * ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   
    // * Deleting participants logic
    // *

    handleDelete: async (checkedParticipants: number[], setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>, setCheckedParticipants: React.Dispatch<React.SetStateAction<number[]>>) => {
        checkedParticipants.forEach((id) => {
            axios.delete(apiUrl + `/participants/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(() => {
                    setParticipants((prev) => prev.filter((participant) => participant.id !== id));
                    setCheckedParticipants([]);
                })
                .catch((error) => {
                    console.error('Error deleting participant:', error);
                });
        });

    }
}