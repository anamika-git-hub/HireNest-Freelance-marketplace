import React from "react";
import { FaLocationArrow, FaPhoneAlt, FaEnvelope } from "react-icons/fa"; 

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center lg:space-x-8 space-y-8 lg:space-y-0 px-4">
      {/* Contact Info Box */}
      <div className="bg-blue-500 rounded-lg p-8 text-white max-w-md w-full flex-grow">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
        <p className="text-sm mb-6">
          Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.
          Vestibulum ante ipsum primis.
        </p>

        {/* Info Blocks */}
        <div className="space-y-6">
          {/* Location */}
          <div className="flex items-start space-x-4">
            <div className="bg-blue-300 p-3 rounded-full">
              <FaLocationArrow className="h-6 w-6 text-blue-800" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Our Location</h3>
              <p className="text-sm">A108 Adam Street</p>
              <p className="text-sm">New York, NY 535022</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-start space-x-4">
            <div className="bg-blue-300 p-3 rounded-full">
              <FaPhoneAlt className="h-6 w-6 text-blue-800" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Phone Number</h3>
              <p className="text-sm">+1 5589 55488 55</p>
              <p className="text-sm">+1 6678 254445 41</p>
            </div>
          </div>

          {/* Email Address */}
          <div className="flex items-start space-x-4">
            <div className="bg-blue-300 p-3 rounded-full">
              <FaEnvelope className="h-6 w-6 text-blue-800" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Email Address</h3>
              <p className="text-sm">info@example.com</p>
              <p className="text-sm">contact@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Get In Touch Box */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full flex-grow">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Get In Touch
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vestibulum ante ipsum primis.
        </p>

        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                id="name"
                className="px-2 mt-1 block w-full rounded-md border-2 border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm h-10"
                placeholder="Your Name"
              />
            </div>
            <div>
              <input
                type="email"
                id="email"
                className="px-2 mt-1 block w-full rounded-md border-2 border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm h-10"
                placeholder="Your Email"
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              id="subject"
              className="px-2 mt-1 block w-full rounded-md border-2 border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm h-10"
              placeholder="Subject"
            />
          </div>
          <div>
            <textarea
              id="message"
              rows={4}
              className="px-2 mt-1 block w-full rounded-md border-2 border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm h-20"
              placeholder="Message"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
