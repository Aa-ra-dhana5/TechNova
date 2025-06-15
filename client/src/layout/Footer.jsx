import React from "react";

function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 via-blue-100 py-16 px-6  select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div className="flex flex-col gap-5 max-w-sm">
          <h3 className="text-white font-extrabold text-3xl">TechNova</h3>
          <p>
            Discover tech made to inspire. Precision, performance, and power—
            only the best for you.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            &copy; {new Date().getFullYear()} TechNova. All rights reserved.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 text-sm">
          <nav aria-label="Shop navigation">
            <h4 className="font-semibold mb-5 text-white text-lg">Shop</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/products/headphones"
                  className="hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                >
                  Headphones
                </a>
              </li>
              <li>
                <a
                  href="/products/speakers"
                  className="hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                >
                  Speakers
                </a>
              </li>
              <li>
                <a
                  href="/products/earbuds"
                  className="hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                >
                  Earbuds
                </a>
              </li>
            </ul>
          </nav>
          <nav aria-label="Support navigation">
            <h4 className="font-semibold mb-5 text-white text-lg">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/contact"
                  className="hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  className="hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                >
                  Returns
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm select-none">
          Designed & Developed by TechNova Team
        </p>
        <div className="flex gap-6">
          <a
            href="https://facebook.com/technova"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.54v-2.2c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.9h-2.3v7.03c4.78-.75 8.44-4.91 8.44-9.93z" />
            </svg>
          </a>
          <a
            href="https://twitter.com/technova"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M23 3a10.9 10.9 0 01-3.14.86A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1 4.5 4.5 0 00-7.7 4.11A12.85 12.85 0 013 2.16a4.5 4.5 0 001.4 6 4.4 4.4 0 01-2-.56v.06a4.5 4.5 0 003.6 4.41 4.48 4.48 0 01-2 .08 4.5 4.5 0 004.2 3.13A9 9 0 012 19.54a12.77 12.77 0 006.92 2.04c8.3 0 12.84-6.88 12.84-12.84 0-.2 0-.41-.02-.61A9.18 9.18 0 0023 3z" />
            </svg>
          </a>
          <a
            href="https://instagram.com/technova"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37a4 4 0 11-4.73-4.73 4 4 0 014.73 4.73z" />
              <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
