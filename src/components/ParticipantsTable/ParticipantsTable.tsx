import { useState, useEffect } from "react";

import formatDate from "../../utils/dateFormatter";
import calculateAge from "../../utils/ageCalculator";

import ParticipantsTableForm from "./ParticipantsTableForm";
import { useParticipantContext } from "../../context/ParticipantContext";
import type { Participant } from "../../types/Participant";

const ParticipantsTable: React.FC = () => {
    const [checkedParticipants, setCheckedParticipants] = useState<number[]>([]);
    const [editingParticipantId, setEditingParticipantId] = useState<number | null>(null);
    const [inputFormVisibility, setInputFormVisibility] = useState<boolean>(false);

    const { participants, getParticipants, deleteParticipants, editParticipant } = useParticipantContext();

    useEffect(() => {
        getParticipants();
    }, [getParticipants]);

    const handleCheckboxChange = (id: number): void => {
        setCheckedParticipants((prev) =>
            prev.includes(id) ? prev.filter((participantId) => participantId !== id) : [...prev, id]
        );
    };

    const handleDelete = async (): Promise<void> => {
        await deleteParticipants(checkedParticipants);
        setCheckedParticipants([]);
    };

    const handleEditToggle = (id: number): void => {
        setEditingParticipantId((prev) => (prev === id ? null : id));
    };

    const handleEditSave = async (
        id: number,
        updatedData: { name: string; email: string; birthdate: string }
    ): Promise<void> => {
        await editParticipant(id, updatedData);
        setEditingParticipantId(null);
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
                        participants.map((participant: Participant) => {
                            if (!participant.id) {
                                // Skip rendering if participant.id is null or undefined
                                return null;
                            }

                            return (
                                <tr
                                    key={participant.id}
                                    className={`table-row ${editingParticipantId === participant.id ? "editing" : ""}`}
                                >
                                    <td className="checkbox-ctn">
                                        {editingParticipantId !== participant.id && (
                                            <label htmlFor={`for_deletion-${participant.id}`}>
                                                <input
                                                    id={`for_deletion-${participant.id}`}
                                                    type="checkbox"
                                                    onChange={() => handleCheckboxChange(participant.id)}
                                                    checked={checkedParticipants.includes(participant.id)}
                                                />
                                            </label>
                                        )}
                                    </td>
                                    {editingParticipantId === participant.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    defaultValue={participant.name}
                                                    onChange={(e) =>
                                                        (participant.name = e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="email"
                                                    defaultValue={participant.email}
                                                    onChange={(e) =>
                                                        (participant.email = e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    defaultValue={formatDate(participant.birthdate, "lt-LT")}
                                                    onChange={(e) =>
                                                        (participant.birthdate = e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEditSave(participant.id!, {
                                                            name: participant.name,
                                                            email: participant.email,
                                                            birthdate: participant.birthdate,
                                                        })
                                                    }
                                                >
                                                    <span className='save-icon'></span>
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{participant.name}</td>
                                            <td>{participant.email}</td>
                                            <td>
                                                {formatDate(participant.birthdate, "lt-LT")} (
                                                {calculateAge(participant.birthdate)})
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="edit-button"
                                                    onClick={() => handleEditToggle(participant.id!)}
                                                >
                                                    <span className='edit-icon'></span>
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td></td>
                            <td></td>
                            <td className="no-data">
                                <p>Empty</p>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="btn-row">
                {inputFormVisibility && <ParticipantsTableForm />}
                <button
                    className="add-btn"
                    onClick={() => setInputFormVisibility((prev) => !prev)}
                >
                    {inputFormVisibility ? "Cancel" : "Add Participant"}
                </button>
                {checkedParticipants.length > 0 && (
                    <button onClick={handleDelete} className="remove-btn">
                        Remove Participant
                    </button>
                )}
            </div>
        </div>
    );
};

export default ParticipantsTable;