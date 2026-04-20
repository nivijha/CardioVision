import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Research from './pages/Research';
import About from './pages/About';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="predict" element={<Predict />} />
        <Route path="research" element={<Research />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
