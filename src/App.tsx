import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Workshops from './pages/Workshops'
import About from './pages/About'
import Contact from './pages/Contact'
import WorkshopDetail from './pages/WorkshopDetail'
import Book from './pages/Book'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'
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
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
