import AboutOilWeek from "./components/AboutOilWeek"
import AboutSPEUISC from "./components/AboutSPEUISC"
import ChainofEvents from "./components/ChainofEvents"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import background from "./images/test.png"

const App = () => {
  return (
    <div className="min-h-screen bg-cover" style={{ backgroundImage: `url(${background})` }}>
      <Navbar />

      <Home />

      <AboutSPEUISC />

      <AboutOilWeek />

      <ChainofEvents />
    </div>
  )
}

export default App