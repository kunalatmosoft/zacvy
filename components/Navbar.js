"use client"
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg`}
    >      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
          <img className="h-8 w-auto" src="https://img.freepik.com/premium-vector/black-abstract-geometrical-letter-z-icon-white-background_95164-12783.jpg" alt="Bacvy" />
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="#features" className="text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
              <a href="#pricing" className="text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-800 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Testimonials</a>
            </div>
          </div>
          <div className="hidden md:block">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300">Sign Up</button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="text-gray-800 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="#features" className="text-gray-800 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Features</a>
            <a href="#pricing" className="text-gray-800 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
            <a href="#testimonials" className="text-gray-800 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Testimonials</a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="mt-3 px-2 space-y-1">
              <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-indigo-600 hover:bg-gray-100">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
