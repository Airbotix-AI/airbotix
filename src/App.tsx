import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Workshops from './pages/Workshops'
import About from './pages/About'
import Contact from './pages/Contact'
import WorkshopDetail from './pages/WorkshopDetail'
import Book from './pages/Book'
import Media from './pages/Media'
import BlogList from './pages/Blog/BlogList'
import BlogDetail from './pages/Blog/BlogDetail'

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
        <Route path="/media" element={<Media />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Routes>
    </Layout>
  )
}

export default App
 