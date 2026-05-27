import AboutOilWeek from "./components/landingpage/AboutOilWeek"
import AboutSPEUISC from "./components/landingpage/AboutSPEUISC"
import AreYouReady from "./components/landingpage/AreYouReady"
import ChainofEvents from "./components/landingpage/ChainofEvents"
import EventTimeline from "./components/landingpage/EventTimeline"
import Footer from "./components/landingpage/Footer"
import Home from "./components/landingpage/Home"
import Navbar from "./components/landingpage/Navbar"
import SeriesofCompetition from "./components/landingpage/SeriesofCompetition"
import useImagePreload from "./hooks/useImagePreload"
import background from "./images/bg-main.png"

const App = () => {
  const bgLoaded = useImagePreload(background)

  return (
    <div className="min-h-screen bg-cover overflow-hidden transition-all" style={{
      backgroundImage: bgLoaded ? `url(${background})` : "none",
      backgroundColor: "#0d1e2e",
      transition: "background-image 0.3s ease",
    }}>
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