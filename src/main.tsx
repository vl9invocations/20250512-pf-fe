import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import ParticipantsPage from './pages/ParticipantsPage.tsx'
import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'
import { ParticipantContextProvider } from './context/participantContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="App">
      <Header />
      <ParticipantContextProvider>
        <ParticipantsPage />
      </ParticipantContextProvider>
      <Footer />
    </div >
  </StrictMode >,
)
