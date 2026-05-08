import AboutOilWeek from "./components/AboutOilWeek"
import AboutSPEUISC from "./components/AboutSPEUISC"
import AreYouReady from "./components/AreYouReady"
import ChainofEvents from "./components/ChainofEvents"
import EventTimeline from "./components/EventTimeline"
import Footer from "./components/Footer"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import SeriesofCompetition from "./components/SeriesofCompetition"
import background from "./images/test.png"

const App = () => {
  return (
    <div className="min-h-screen bg-cover overflow-hidden" style={{ backgroundImage: `url(${background})` }}>
      <Navbar />

      <Home />

      <AboutSPEUISC />

      <AboutOilWeek />

      <ChainofEvents />

      <SeriesofCompetition />

      <EventTimeline />

      <AreYouReady />

      <Footer />
    </div>
  )
}

export default App