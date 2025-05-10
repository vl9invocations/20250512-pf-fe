import { useState, useEffect, use } from "react";
import axios from "axios";

interface Participant {
    id: number;
    name: string;
    email: string;
    birthdate: string;
    createdAt: string;
    updatedAt: string;
}

const getAge = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};


const ParticipantsTable = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [checkedParticipants, setCheckedParticipants] = useState<number[]>([]);
    const [editingParticipant, setEditingParticipant] = useState<number[]>([]);
    const [inputFormVisiblity, setInputFormVisiblity] = useState<boolean>(false);


    const getParticipants = () => {
        axios.get<Participant[]>('http://localhost:5100/api/v1/participants', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.data.data == null) {
                    //     console.error('Error fetching participants:', response.data.message);
                    return;
                }
                setParticipants(response.data.data);
                console.log("Checked participants:");
                // console.log(participants);
            })
            .catch((error) => {
                console.error('Error fetching participants:', error);
            });
    }

    useEffect(() => {
        // Fetch participants when the component mounts and every 5 seconds
        getParticipants();
        setInterval(() => {
            getParticipants();
        }, 60000);
    }, []);

    useEffect(() => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            const row = checkbox.closest('tr');
            if (row) {
                if (checkedParticipants.includes(Number(checkbox.id.split('-')[1]))) {
                    row.classList.add('checked');
                } else {
                    row.classList.remove('checked');
                }
            }
        });
    }, [checkedParticipants]);

    const handleCheckboxChange = (id: number) => () => {
        setCheckedParticipants((prev) => {
            if (prev.includes(id)) {
                return prev.filter((participantId) => participantId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleDelete = () => {
        checkedParticipants.forEach((id) => {
            axios.delete(`http://localhost:5100/api/v1/participants/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(() => {
                    setParticipants((prev) => prev.filter((participant) => participant.id !== id));
                    setCheckedParticipants((prev) => prev.filter((participantId) => participantId !== id));
                })
                .catch((error) => {
                    console.error('Error deleting participant:', error);
                });
        });
    }

    const enableEditingParticipant = (id: number) => () => {
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
            axios.put(`http://localhost:5100/api/v1/participants/${id}`, updatedParticipant, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    console.log(response.data);
                    getParticipants();
                })
                .catch((error) => {
                    console.error('Error updating participant:', error);
                });
        }
    }

    const handleAddParticipant = (event: React.FormEvent): void => {
        event.preventDefault();
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
        axios.post('http://localhost:5100/api/v1/participants', newParticipant, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response.data);
                getParticipants();
                nameInput.value = '';
                emailInput.value = '';
                birthdateInput.value = '';
            })
            .catch((error) => {
                console.error('Error adding participant:', error);
            });
    }


    return (
        <div className="table-ctn">
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name | Surname</th>
                        <th>Email</th>
                        <th>Birthdate</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {participants.length > 0 ? (
                        participants.map((participant, index) => {

                            if (editingParticipant.includes(participant.id)) {
                                return (
                                    <tr key={index} className="table-row">
                                        <td className='checkbox-ctn'>
                                            <label htmlFor={"for_deletion-" + participant.id} >
                                                <input id={"for_deletion-" + participant.id} type="checkbox" onClick={handleCheckboxChange(participant.id)} disabled />
                                            </label>
                                        </td>
                                        <td>
                                            <input id="edited-name" type="text" defaultValue={participant.name} />
                                        </td>
                                        <td>
                                            <input id="edited-email" type="email" defaultValue={participant.email} />
                                        </td>
                                        <td>
                                            <input id="edited-birthdate" type="date" defaultValue={participant.birthdate} />
                                        </td>

                                        <td>
                                            <button type='submit' className='edit-button' onClick={enableEditingParticipant(participant.id)}>
                                                <span className='edit-icon'></span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            } else {
                                return (

                                    <tr key={index} className="table-row">
                                        <td className='checkbox-ctn'>
                                            <label htmlFor={"for_deletion-" + participant.id} >
                                                <input id={"for_deletion-" + participant.id} type="checkbox" onClick={handleCheckboxChange(participant.id)} />
                                            </label>
                                        </td>
                                        <td>{participant.name}</td>
                                        <td>{participant.email}</td>
                                        <td>{participant.birthdate} ({getAge(participant.birthdate)})</td>

                                        <td>
                                            <button type='submit' className='edit-button' onClick={enableEditingParticipant(participant.id)}>
                                                <span className='edit-icon'></span>
                                            </button>
                                        </td>
                                    </tr>
                                )

                            }
                        })
                    ) : (
                        <tr>
                            <td></td>
                            <td></td>
                            <td className="no-data" colSpan={1}>
                                Empty
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    )}

                </tbody>
            </table >
            <div className="btn-row">
                {inputFormVisiblity && (
                    <form className="addParticipant-form" onSubmit={handleAddParticipant}>
                        <div className="addParticipant-form__inputs">
                            <input type="text" placeholder="Name" id="name" />
                            <input type="email" placeholder="Email" id="email" />
                            <input type="date" placeholder="Birthdate" id="birthdate" />
                        </div>
                        <button type="submit" className="add-btn">
                            Add participant
                        </button>
                    </form>
                )}
                <button className="add-btn" onClick={() => setInputFormVisiblity((prev) => !prev)}>
                    {inputFormVisiblity ? "Cancel" : "Add Participant"}
                </button>
                {checkedParticipants.length > 0 && (
                    <button onClick={handleDelete} className="remove-btn">
                        Remove Participant
                    </button>
                )}
            </div>
        </div >
    )
}

export default ParticipantsTable