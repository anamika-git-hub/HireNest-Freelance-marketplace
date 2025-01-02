import React from "react";

const About: React.FC = () => {
  return (
    <section className="hero section pt-20 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden">
      {/* About Section */}
      <div className="py-12 sm:px-8 lg:px-40">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="w-full lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">About our company</h2>
          <p className="text-gray-500 mt-4 mb-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Donec magna pharetra 
            dignissim nibh turpis pretium. Integer placerat in magna laoreet nibh.
          </p>
            <img
              src={"/assets/services.jpg"}
              alt="Team working"
              className="rounded-lg shadow-md w-5/6"
            />
          </div>
          <div className="w-full lg:w-1/2 text-left">
          <img
              src={"/assets/about-5.webp"}
              alt="Team working"
              className="rounded-lg shadow-md w-5/6"
            />
            <p className="text-gray-500 mt-5 mb-6">
              Sit pellentesque eget arcu elementum pharetra. Duis convallis nulla porttitor
              diam porttitor euismod quis luctus consequat neque tempor tortor.
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Hire freelancer
              </button>
              <button className="bg-gray-100 border border-blue-600 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Numbers Section */}
      <div className="bg-gray-50 py-12 px-4  sm:px-8 lg:px-20">
      
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold">Our amazing numbers</h2>
          <p className="text-gray-500 mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit ac non sit
            quis solitudinem quam blandit amet id mi ac eget facilis.
          </p>
        </div>
        
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-gray-900">2,000</p>
            <p className="text-gray-500 mt-2">Freelancers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">30,000+</p>
            <p className="text-gray-500 mt-2">Successful projects</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">1,500</p>
            <p className="text-gray-500 mt-2">Happy clients</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">500</p>
            <p className="text-gray-500 mt-2">5 stars reviews</p>
          </div>
        </div>
       
      </div>

      {/* Values Section */}
      <div className="bg-slate-200 flex gap-8 py-12 px-4 sm:px-8 lg:px-20">
        <div className="w-full lg:w-1/4 ">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold">The values that drive everything we do</h2>
          <p className="text-gray-500 mt-4">
            Lorem ipsum dolor sit amet consectetur adipiscing elit ac non sit 
            quis solitudinem quam blandit amet id mi ac eget facilis gravida.
          </p>
        </div>
        </div>
        <div className="w-full lg:w-3/4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center p-6 border rounded-lg">
            <div className="text-blue-600 text-5xl mb-4">📈</div>
            <h3 className="text-xl font-semibold">Growth</h3>
            <p className="text-gray-500 mt-2">
              Lorem ipsum dolor sit amet consectetur adipiscing elit nibh libero ultrices 
              vulputate congue.
            </p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="text-purple-600 text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold">Quality</h3>
            <p className="text-gray-500 mt-2">
              Semper id tellus hac duis vitae arcu duis elementum id in sed lectus pellentesque praesent.
            </p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="text-teal-600 text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold">Teamwork</h3>
            <p className="text-gray-500 mt-2">
              Tortor vitae nulla bibendum integer socios blandit augue sit molestie aliquam vitae neque.
            </p>
          </div>
        </div>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="px-6 py-16 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
  <div className="flex-1">
    <h2 className="text-4xl font-bold mb-6">Why join us?</h2>
    <p className="text-gray-600 mb-6">
      Lorem ipsum dolor sit amet consectetur adipiscing elit sapien eget eu elementum velit nunc
      tortor pulvinar ornare at mi sed nisl in proin sollicitudin ultricies aliquet malesuada
      aliquet.
    </p>
    <div className="grid grid-cols-2 gap-4">
      {[
        { icon: '⭐', text: 'Good leads' },
        { icon: '💻', text: 'Work remotely' },
        { icon: '🔄', text: 'Constant work' },
        { icon: '👀', text: 'Hundreds of visitors and jobs' },
        { icon: '⏰', text: 'Work on your time' },
        { icon: '📉', text: 'Low commission: Pay only 10%' },
      ].map((item, index) => (
        <div key={index} className="flex items-center gap-2 text-gray-600">
          <span className="text-primary text-2xl">{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  </div>
  <div className="flex-1 relative">
    {/* Testimonial block */}
    <div className="absolute top-80  bg-white rounded-lg shadow-lg p-6 max-w-xs">
      <blockquote className="italic text-gray-600 mb-4">
        "Thanks to Workplaces I’ve found my best clients"
      </blockquote>
      <p className="text-gray-500">
        Lorem ipsum dolor sit amet consectetur non adipiscing elit gravida posuere.
      </p>
      <p className="mt-4 font-bold text-primary">Lilly Woods — Brand Designer</p>
    </div>
    {/* Image */}
    <img
      src={"/assets/about-2.webp"}
      alt="Testimonial"
      className="rounded-lg shadow-lg w-5/6"
    />
  </div>
</div>

    </section>
  );
};

export default About;
