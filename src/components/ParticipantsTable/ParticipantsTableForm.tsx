import type { Participant } from "../../types/Participant";
import { apiCommunicationServices } from "../../services/apiCommunicationServices";

const ParticipantsTableForm = async (setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>) => {

    return (
        <form className="addParticipant-form" onSubmit={async (event) => {
            event.preventDefault();
            await apiCommunicationServices.addParticipant(setParticipants);
        }}>
            <div className="addParticipant-form__inputs">
                <input type="text" placeholder="Name" id="name" />
                <input type="email" placeholder="Email" id="email" />
                <input type="date" id="birthdate" />
            </div>
            <button type="submit" className="add-btn">
                Add participant
            </button>
        </form>
    )
}

export default ParticipantsTableForm;