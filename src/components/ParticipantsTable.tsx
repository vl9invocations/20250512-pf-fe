import { useState, useEffect } from "react";

/**
 * ParticipantsTable is a React functional component that renders a table displaying participant information.
 * It includes features such as checkboxes for selecting participants and a button for editing participant details.
 *
 * @component
 *
 * @returns {JSX.Element} A table displaying participant data with checkboxes and edit buttons.
 *
 * @remarks
 * - The component uses the `useState` hook to manage the state of selected participants.
 * - The `getAge` function calculates the age of a participant based on their birthdate.
 * - Example participant data is hardcoded for demonstration purposes.
 * - The table rows are dynamically generated using a combination of `Array.from` and `map`.
 *
 * @example
 * ```tsx
 * <ParticipantsTable />
 * ```
 *
 * @function
 * @name ParticipantsTable
 */


const ParticipantsTable = () => {

    const exampleData = [
        {
            id: 1,
            name: "John Riviera",
            email: "test@sample.world",
            birthdate: "1990-01-01",
        }
    ]

    const [checkedParticipants, setCheckedParticipants] = useState<number[]>([]);



    const getAge = (birthdate: string) => {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }



    const handleCheckboxChange = (id: number) => () => {
        setCheckedParticipants((prev) => {
            if (prev.includes(id)) {
                return prev.filter((participantId) => participantId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    //change color based by watching to the checkedParticipants state
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

                    {Array.from({
                        length: 17
                    }).map((_, index) => (
                        exampleData.map((participant) => (
                            <tr key={index}>
                                <td className='checkbox-ctn'>


                                    <label htmlFor={"for_deletion-" + index} >
                                        <input id={"for_deletion-" + index} type="checkbox" onClick={handleCheckboxChange(index)} />
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
                        ))
                    ))}
                </tbody>
            </table >
        </div >
    )
}

export default ParticipantsTable