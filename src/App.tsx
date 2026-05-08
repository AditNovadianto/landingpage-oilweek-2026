import AboutOilWeek from "./components/AboutOilWeek"
import AboutSPEUISC from "./components/AboutSPEUISC"
import ChainofEvents from "./components/ChainofEvents"
import EventTimeline from "./components/EventTimeline"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import SeriesofCompetition from "./components/SeriesofCompetition"
import background from "./images/test.png"

const App = () => {
  return (
    <div className="min-h-screen bg-cover" style={{ backgroundImage: `url(${background})` }}>
      <Navbar />

      <Home />

      <AboutSPEUISC />

      <AboutOilWeek />

      <ChainofEvents />

      <SeriesofCompetition />

      <EventTimeline />
    </div>
  )
}

export default App