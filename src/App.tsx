import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Workshops from './pages/Workshops'
import About from './pages/About'
import Contact from './pages/Contact'
import WorkshopDetail from './pages/WorkshopDetail'
import Book from './pages/Book'
import Media from './pages/Media'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/workshops/:id" element={<WorkshopDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<Book />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/media" element={<Media />} />
      </Routes>
    </Layout>
  )
}

export default App