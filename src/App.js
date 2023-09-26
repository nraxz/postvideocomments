import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

// pages
import Home from "./pages/Home"
import Create from "./pages/Create"
import Update from "./pages/Update"
import Review from './pages/Review';
import Detail from './pages/Detail';
import Playback from './pages/Playback';


function App() {
  return (
    <BrowserRouter>
      <nav>
        <h1>नेपाली मेडिया प्रोपोगान्डा </h1>
        <Link to="/">मुख्य पृष्ट</Link>
        <Link to="/create">नया प्रोपोगान्डा </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/review/:postId" element={<Review />} />
        <Route path="/detail/:postId" element={<Detail />} />
        <Route path="/playback/:videoName" element={<Playback />} />
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<Update />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
