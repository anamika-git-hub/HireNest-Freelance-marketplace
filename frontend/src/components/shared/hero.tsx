import React from "react";

const HeroSection = () => {
  return (
<section id="hero" className="hero section pt-20 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden">
      <div className="container mx-20 px-6">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <div className="hero-content text-left">
              <div className="inline-flex items-center px-4 py-2 mb-4 bg-blue-200 text-blue-600 font-medium rounded-full">
                <i className="bi bi-gear-fill me-2"></i>
                Working for your success
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Hire The best <br />
                Freelancers in the <br />
                <span className="text-blue-600">Tech Industry</span>
              </h1>
              <p className="text-gray-600 mb-6">
              Huge community of designers, developers, and creatives ready for your project.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href=""
                  className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition"
                >
                  Find Talent
                </a>
                <a
                  href=""
                  className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition"
                >
                  <i className="bi bi-play-circle text-xl mr-2"></i> Find Work
                </a>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <div className="text-center">
              <img
                src="/assets/illustration-1.webp"
                alt="Hero Illustration"
                className="w-full max-w-md mx-auto lg:max-w-lg"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap items-center justify-between mt-16 bg-gray-50 shadow-md rounded-lg p-6">
          {/* Stat Item 1 */}
          <div className="flex items-center gap-4 w-full md:w-1/4">
            <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-full">
              <i className="bi bi-trophy text-blue-600 text-2xl"></i>
            </div>
            <div>
              <h4 className="text-lg font-semibold">2,303</h4>
              <p className="text-gray-500 text-sm">Clients</p>
            </div>
          </div>

          {/* Stat Item 2 */}
          <div className="flex items-center gap-4 w-full md:w-1/4">
            <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-full">
              <i className="bi bi-briefcase text-blue-600 text-2xl"></i>
            </div>
            <div>
              <h4 className="text-lg font-semibold">2,393</h4>
              <p className="text-gray-500 text-sm">Tasks posted</p>
            </div>
          </div>

          {/* Stat Item 3 */}
          <div className="flex items-center gap-4 w-full md:w-1/4">
            <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-full">
              <i className="bi bi-graph-up text-blue-600 text-2xl"></i>
            </div>
            <div>
              <h4 className="text-lg font-semibold">2,321</h4>
              <p className="text-gray-500 text-sm">Freelancers</p>
            </div>
          </div>

          {/* Stat Item 4 */}
          <div className="flex items-center gap-4 w-full md:w-1/4">
            <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-full">
              <i className="bi bi-award text-blue-600 text-2xl"></i>
            </div>
            <div>
              <h4 className="text-lg font-semibold">2,004</h4>
              <p className="text-gray-500 text-sm">Tasks completed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
