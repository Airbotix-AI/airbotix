import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI & Robotics Education for
              <span className="text-primary-600"> K-12 Students</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Empowering Australia's next generation with cutting-edge AI and Robotics education. 
              Interactive workshops, hands-on learning, and future-ready skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book" className="btn-primary text-lg px-8 py-3">
                Book a Workshop
              </Link>
              <Link to="/workshops" className="btn-outline text-lg px-8 py-3">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Airbotix?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're dedicated to making AI and Robotics education accessible, engaging, and practical for students across Australia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hands-On Learning</h3>
              <p className="text-gray-600">
                Interactive workshops with real robots and AI tools that students can touch, program, and control.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curriculum Aligned</h3>
              <p className="text-gray-600">
                Programs designed to complement Australian curriculum standards and enhance STEM learning outcomes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from industry professionals and educators passionate about technology and student success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Workshop Gallery</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Moments from our AI and Robotics workshops — hands-on learning, teamwork, and lots of fun.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                src: 'https://picsum.photos/seed/airbotix-1/800/600',
                alt: 'Student programming a robot',
              },
              {
                src: 'https://picsum.photos/seed/airbotix-2/800/600',
                alt: 'Robotics workshop table',
              },
              {
                src: 'https://picsum.photos/seed/airbotix-3/800/600',
                alt: 'AI and coding session',
              },
              {
                src: 'https://picsum.photos/seed/airbotix-4/800/600',
                alt: 'Teamwork on a challenge',
              },
              {
                src: 'https://picsum.photos/seed/airbotix-5/800/600',
                alt: 'Electronics and prototyping',
              },
              {
                src: 'https://picsum.photos/seed/airbotix-6/800/600',
                alt: 'Computer vision demo',
              },
              {
                src: 'https://picsum.photos/seed/airbotix-7/800/600',
                alt: 'Classroom presentation',
              },
              {
                src: 'https://picsum.photos/seed/airbotix-8/800/600',
                alt: 'Coding activity',
              },
            ].map((img) => (
              <div key={img.src} className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-100">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Educators Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Feedback from schools and communities we partner with across Australia.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[ 
              {
                quote:
                  'Our students were absolutely engaged. The hands-on activities made complex AI concepts accessible and exciting.',
                name: 'Sarah Williams',
                role: 'STEM Coordinator, Riverdale Primary',
              },
              {
                quote:
                  'The workshop aligned perfectly with our curriculum and inspired several new lunchtime robotics clubs.',
                name: 'James O’Connor',
                role: 'Deputy Principal, Northview College',
              },
              {
                quote:
                  'Professional, well-structured, and fun. Students developed real confidence with coding and robotics.',
                name: 'Emily Zhang',
                role: 'Digital Technologies Lead, Eastside High',
              },
            ].map((t) => (
              <div key={t.name} className="p-6 border border-gray-200 rounded-2xl shadow-sm bg-white">
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7.17 6A3.17 3.17 0 004 9.17V16h6V9.17A3.17 3.17 0 006.83 6H7.17zm8 0A3.17 3.17 0 0012 9.17V16h6V9.17A3.17 3.17 0 0014.83 6h.34z" />
                  </svg>
                  <p className="text-gray-700 leading-7">{t.quote}</p>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your AI & Robotics Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students across Australia who are already learning the skills of tomorrow.
          </p>
          <Link to="/book" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold text-lg px-8 py-3 rounded-lg transition-colors duration-200">
            Book Your Workshop Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home