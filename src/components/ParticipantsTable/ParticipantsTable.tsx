import { useState, useEffect } from "react";

import formatDate from "../../utils/dateFormatter";
import calculateAge from "../../utils/ageCalculator";
import type { Participant } from "../../types/Participant";

import { apiCommunicationServices } from "../../services/apiCommunicationServices";
import ParticipantsTableForm from "./ParticipantsTableForm";


const ParticipantsTable = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [checkedParticipants, setCheckedParticipants] = useState<number[]>([]);
    const [editingParticipant, setEditingParticipant] = useState<number[]>([]);
    const [inputFormVisiblity, setInputFormVisiblity] = useState<boolean>(false);



    useEffect(() => {
        apiCommunicationServices.getParticipants(setParticipants);
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
                    {participants.length > 0 ? (
                        participants.map((participant, index) => {

                            if (editingParticipant.includes(participant.id)) {
                                return (
                                    <tr key={index} className="table-row editing">
                                        <td>
                                        </td>
                                        <td>
                                            <input id="edited-name" type="text" defaultValue={participant.name} />
                                        </td>
                                        <td>
                                            <input id="edited-email" type="email" defaultValue={participant.email} />
                                        </td>
                                        <td>
                                            <input id="edited-birthdate" type="date" defaultValue={formatDate(participant.birthdate, 'lt-LT')} />
                                        </td>

                                        <td>
                                            <button type='submit' className='edit-button' onClick={async () => await apiCommunicationServices.enableEditingParticipant(participant.id, editingParticipant, setParticipants, setEditingParticipant)}>
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
                                                <input id={"for_deletion-" + participant.id} type="checkbox" onClick={handleCheckboxChange(participant.id)} defaultChecked={checkedParticipants.includes(participant.id)} />
                                            </label>
                                        </td>
                                        <td>{participant.name}</td>
                                        <td>{participant.email}</td>
                                        <td>{formatDate(participant.birthdate, 'lt-LT')} ({calculateAge(participant.birthdate)})</td>

                                        <td>
                                            <button type='submit' className='edit-button' onClick={async () => await apiCommunicationServices.enableEditingParticipant(participant.id, editingParticipant, setParticipants, setEditingParticipant)}>
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
                            <td className="no-data">
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
                    <ParticipantsTableForm setParticipants={setParticipants} />
                )}
                <button className="add-btn" onClick={() => setInputFormVisiblity((prev) => !prev)}>
                    {inputFormVisiblity ? "Cancel" : "Add Participant"}
                </button>
                {checkedParticipants.length > 0 && (
                    <button onClick={async () => await apiCommunicationServices.handleDelete(checkedParticipants, setParticipants, setCheckedParticipants)} className="remove-btn">
                        Remove Participant
                    </button>
                )}
            </div>
        </div >
    )
}

export default ParticipantsTable