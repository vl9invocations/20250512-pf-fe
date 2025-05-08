import ParticipantsTable from "../components/ParticipantsTable"

function ParticipantsPage() {
  return (
    <div className="participants-page">
      <div className="participants-page__menu">
        <div className="participants-page__left-menu">
          <h1>Participants</h1>
          <p>Here you can manage the participants of your event.</p>
        </div>
        <div className="participants-page__right-menu">
          <div className="event-name">
            <h2>Event Name</h2>
          </div>
        </div>
      </div>
      <ParticipantsTable />
    </div>
  )
}

export default ParticipantsPage
