import { useState, useEffect } from "react";
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

    useEffect(() => {
        axios.get<Participant[]>('http://localhost:5100/api/v1/participants', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                setParticipants(response.data.data);
                // console.log(participants);
            })
            .catch((error) => {
                console.error('Error fetching participants:', error);
            });
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
                    {participants.map((participant, index) => (
                        <tr key={index}>
                            <td className='checkbox-ctn'>
                                <label htmlFor={"for_deletion-" + participant.id} >
                                    <input id={"for_deletion-" + participant.id} type="checkbox" onClick={handleCheckboxChange(participant.id)} />
                                </label>
                            </td>
                            <td>{participant.name}</td>
                            <td>{participant.email}</td>
                            <td>{participant.birthdate} ({getAge(participant.birthdate)})</td>

                            <td>
                                <button type='submit' className='edit-button'>
                                    <span className='edit-icon'></span>
                                </button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table >
        </div >
    )
}

export default ParticipantsTable