import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-4 left-0 right-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full max-w-[85rem] mx-auto">
      <nav
        className={`relative w-full flex flex-wrap md:grid md:grid-cols-12 basis-full items-center mx-4 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-sm shadow-lg rounded-[36px] py-3 px-4"
            : ""
        }`}
      >
        <div className="md:col-span-3">
          <a
            className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
            href="../templates/creative-agency/index.html"
            aria-label="Syntropix.AI"
          >
            <svg
              className="w-28 h-auto"
              width="116"
              height="32"
              viewBox="0 0 116 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 29.5V16.5C1 9.87258 6.37258 4.5 13 4.5C19.6274 4.5 25 9.87258 25 16.5C25 23.1274 19.6274 28.5 13 28.5H12"
                className="stroke-black dark:stroke-white"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M5 29.5V16.66C5 12.1534 8.58172 8.5 13 8.5C17.4183 8.5 21 12.1534 21 16.66C21 21.1666 17.4183 24.82 13 24.82H12"
                className="stroke-black dark:stroke-white"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                cx="13"
                cy="16.5214"
                r="5"
                className="fill-black dark:fill-white"
                fill="currentColor"
              />

              <text
                x="30"
                y="20"
                font-size="10"
                font-family="Arial, sans-serif"
                fill="currentColor"
                className="fill-black dark:fill-white"
              >
                syntropix
              </text>
            </svg>
          </a>
        </div>

        <div className="flex items-center gap-x-1 md:gap-x-2 ms-auto py-1 md:ps-6 md:order-3 md:col-span-3">
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-lime-400 text-black hover:bg-lime-500 focus:outline-none focus:bg-lime-500 transition disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </button>

          <div className="md:hidden">
            <button
              type="button"
              className="hs-collapse-toggle size-[38px] flex justify-center items-center text-sm font-semibold rounded-xl border border-gray-200 text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              id="hs-navbar-hcail-collapse"
              aria-expanded="false"
              aria-controls="hs-navbar-hcail"
              aria-label="Toggle navigation"
              data-hs-collapse="#hs-navbar-hcail"
            >
              <svg
                className="hs-collapse-open:hidden shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg
                className="hs-collapse-open:block hidden shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="hs-navbar-hcail"
          className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block md:w-auto md:basis-auto md:order-2 md:col-span-6"
          aria-labelledby="hs-navbar-hcail-collapse"
        >
          <div className="flex flex-col gap-y-4 gap-x-0 mt-5 md:flex-row md:justify-center md:items-center md:gap-y-0 md:gap-x-7 md:mt-0">
            <div>
              <Link
                to="/"
                className={`relative inline-block text-black focus:outline-none ${
                  isActiveRoute("/")
                    ? "before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400"
                    : "hover:text-gray-600"
                } dark:text-white`}
              >
                About
              </Link>
            </div>
            <div>
              <Link
                to="/products"
                className={`relative inline-block text-black focus:outline-none ${
                  isActiveRoute("/products")
                    ? "before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400"
                    : "hover:text-gray-600"
                } dark:text-white dark:hover:text-neutral-300`}
              >
                Products
              </Link>
            </div>
            <div>
              <Link
                to="/services"
                className={`relative inline-block text-black focus:outline-none ${
                  isActiveRoute("/services")
                    ? "before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400"
                    : "hover:text-gray-600"
                } dark:text-white dark:hover:text-neutral-300`}
              >
                Services
              </Link>
            </div>
            <div>
              <Link
                to="/teams"
                className={`relative inline-block text-black focus:outline-none ${
                  isActiveRoute("/teams")
                    ? "before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400"
                    : "hover:text-gray-600"
                } dark:text-white dark:hover:text-neutral-300`}
              >
                Team
              </Link>
            </div>
            <div>
              <Link
                to="/blog"
                className={`relative inline-block text-black focus:outline-none ${
                  isActiveRoute("/blog")
                    ? "before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400"
                    : "hover:text-gray-600"
                } dark:text-white dark:hover:text-neutral-300`}
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
