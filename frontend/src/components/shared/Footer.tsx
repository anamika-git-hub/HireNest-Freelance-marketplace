import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-blue-950 text-gray-200 py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">About Us</h3>
                        <p className="text-gray-400 text-sm">
                            We connect freelancers and clients worldwide, providing a platform for seamless collaboration on any project.
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#how-it-works" className="hover:text-white">
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a href="#popular-categories" className="hover:text-white">
                                    Categories
                                </a>
                            </li>
                            <li>
                                <a href="#about" className="hover:text-white">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="hover:text-white">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white"
                            >
                                <i className="fab fa-facebook-f"></i> Facebook
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white"
                            >
                                <i className="fab fa-twitter"></i> Twitter
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white"
                            >
                                <i className="fab fa-linkedin-in"></i> LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 mt-8 pt-4">
                    <p className="text-center text-gray-400 text-sm">
                        © {new Date().getFullYear()} Freelance Marketplace. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
