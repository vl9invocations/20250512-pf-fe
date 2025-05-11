import ParticipantsTable from "../components/ParticipantsTable/ParticipantsTable"
import { ParticipantPageMenu } from "../components/ParticipantPageMenu"

function ParticipantsPage() {

  return (
    <div className="participants-page">
      <ParticipantPageMenu />
      <ParticipantsTable />
    </div>
  )
}

export default ParticipantsPage
