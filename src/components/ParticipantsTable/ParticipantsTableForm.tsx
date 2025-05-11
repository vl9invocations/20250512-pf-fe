import { useState } from "react";
import { useParticipantContext } from "../../context/participantContext";
import { validateForm } from "../../utils/validateForm";

const ParticipantsTableForm = () => {
    const { addParticipant } = useParticipantContext();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        birthdate: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        await addParticipant(formData);
        setFormData({ name: "", email: "", birthdate: "" });
        setErrors({});
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
                {errors.name && <span className="error">{errors.name}</span>}
                <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                {errors.email && <span className="error">{errors.email}</span>}
                <input
                    type="date"
                    id="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    required
                />
                {errors.birthdate && <span className="error">{errors.birthdate}</span>}
            </div>
            <button type="submit" className="add-btn">
                Add participant
            </button>
        </form>
    );
};

export default ParticipantsTableForm;