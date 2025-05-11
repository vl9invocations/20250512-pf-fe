import { useState } from "react";
import { useParticipantContext } from "../../context/ParticipantContext";

const ParticipantsTableForm = () => {
    const { addParticipant } = useParticipantContext();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        birthdate: "",
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await addParticipant(formData);
        setFormData({ name: "", email: "", birthdate: "" });
    };

    return (
        <form className="addParticipant-form" onSubmit={handleSubmit}>
            <div className="addParticipant-form__inputs">
                <input
                    type="text"
                    placeholder="Name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    id="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <button type="submit" className="add-btn">
                Add participant
            </button>
        </form>
    );
};

export default ParticipantsTableForm;