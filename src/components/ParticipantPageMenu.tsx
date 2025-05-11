import { useParticipantContext } from "../context/participantContext";

export const ParticipantPageMenu = () => {
    const { getParticipants } = useParticipantContext();

    const handlePageRefresh = async () => {
        await getParticipants();
    };

    return (
        <div className="participants-page__menu">
            <div className="participants-page__left-menu">
                <h1>Participants</h1>
                <p>Here you can manage the participants of your event.</p>
            </div>
            <div className="participants-page__right-menu">
                <div className="event-name">
                    <h2>Event Name</h2>
                </div>
                <button className="refresh-btn" onClick={handlePageRefresh}>
                    <span className="refresh-icon"></span>
                </button>
            </div>
        </div>
    );
};