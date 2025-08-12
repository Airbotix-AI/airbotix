const values = [
  {
    title: 'Student-Centered',
    description:
      'We design experiences that spark curiosity and build confidence through hands-on learning.',
  },
  {
    title: 'Real-World Skills',
    description:
      'From problem solving to collaboration, our programs prepare students for the future of work.',
  },
  {
    title: 'Equity & Access',
    description:
      'We strive to make AI and Robotics education accessible to all students across Australia.',
  },
  {
    title: 'Responsible AI',
    description:
      'Ethics, safety, and responsible technology use are embedded throughout our curriculum.',
  },
]

const team = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    bio: 'Educator and engineer focused on bringing industry-grade STEM learning to classrooms.',
    initials: 'AC',
  },
  {
    name: 'Maya Singh',
    role: 'Head of Curriculum',
    bio: 'Curriculum designer passionate about inquiry-based learning and inclusive education.',
    initials: 'MS',
  },
  {
    name: 'Daniel Park',
    role: 'Lead Robotics Instructor',
    bio: 'Robotics specialist with experience mentoring national competition teams.',
    initials: 'DP',
  },
]

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Airbotix</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering the next generation with AI and Robotics education that is engaging, responsible, and future-ready.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-8 border border-gray-200 rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-7">
              To inspire K-12 students across Australia to explore, create, and lead with technology by delivering
              hands-on, curriculum-aligned AI and Robotics learning experiences.
            </p>
          </div>
          <div className="p-8 border border-gray-200 rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Vision</h2>
            <p className="text-gray-700 leading-7">
              A world where every student has the opportunity to understand and shape the intelligent systems that power
              our future.
            </p>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Impact</h2>
            <p className="text-gray-600 mt-2">Growing reach across schools, communities, and regions.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-primary-600">5k+</div>
              <div className="text-gray-600 mt-1">Students Reached</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-primary-600">120+</div>
              <div className="text-gray-600 mt-1">Workshops Delivered</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-primary-600">35+</div>
              <div className="text-gray-600 mt-1">Partner Schools</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-primary-600">8</div>
              <div className="text-gray-600 mt-1">Regions Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="text-gray-600 mt-2">Principles that guide our programs and partnerships.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 border border-gray-200 rounded-2xl bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-700">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            <p className="text-gray-600 mt-2">Experienced educators and engineers united by a shared mission.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="p-6 border border-gray-200 rounded-2xl bg-white text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-semibold mb-4">
                  {member.initials}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <div className="text-primary-700 font-medium mb-2">{member.role}</div>
                <p className="text-gray-700">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Partner with Airbotix</h2>
          <p className="text-primary-100 max-w-2xl mx-auto mb-8">
            We collaborate with schools, clubs, libraries, and community groups to deliver tailored programs.
          </p>
          <button className="bg-white text-primary-600 hover:bg-gray-50 font-semibold text-lg px-8 py-3 rounded-lg transition-colors">
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  )
}

export default About

