export default function Partners() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Our Partners
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Working together with schools, organizations, and companies to bring 
              AI and robotics education to K-12 students everywhere.
            </p>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Collaboration
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Educational Partners
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We partner with educational institutions and organizations to expand 
            access to STEM education and prepare students for the future.
          </p>
        </div>

        {/* Partner Categories */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Schools */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Schools</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900">Elementary Schools</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Introducing young minds to basic robotics and coding concepts
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900">Middle Schools</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Building foundational skills in AI and robotics
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900">High Schools</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Advanced workshops preparing students for college and careers
                </p>
              </div>
            </div>
          </div>

          {/* Organizations */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Organizations</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900">Libraries</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Community-based learning programs and maker spaces
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900">STEM Centers</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Specialized facilities for hands-on STEM education
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900">Youth Programs</h4>
                <p className="text-gray-600 text-sm mt-1">
                  After-school and summer programs focused on technology
                </p>
              </div>
            </div>
          </div>

          {/* Companies */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Companies</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900">Tech Companies</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Industry partnerships providing real-world context
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900">Educational Publishers</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Curriculum development and educational resources
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900">Hardware Suppliers</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Providing robotics kits and educational hardware
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Become a Partner
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join us in making AI and robotics education accessible to all students. 
            Together, we can prepare the next generation for a technology-driven future.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}