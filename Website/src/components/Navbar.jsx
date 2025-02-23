import { useState, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./component";
import { Link, useLocation } from "react-router-dom";
import FlowingMenu from "./Animated/FlowingMenu";
import { CgProfile } from "react-icons/cg";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle smooth scrolling for "Services"
  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false); // Close mobile menu after clicking
    }
  };

  // Define base menu items (removed "Contact Us")
  const baseMenuItems = useMemo(
    () => [
      {
        text: "services",
        action: (e) => handleScrollToSection(e, "services-section"), // Scroll function
        image: "/images/services.png",
      },
      {
        link: "/about",
        text: "about_us",
        image: "/images/about.png",
      },
    ],
    []
  );

  // Define auth menu items
  const authMenuItems = useMemo(
    () => [
      {
        link: "/auth/signup",
        text: "sign_up",
        image: "/images/signup.png",
      },
      {
        link: "/auth/signin",
        text: "sign_in",
        image: "/images/signin.png",
      },
    ],
    []
  );

  // Combine menu items based on location
  const menuItems = useMemo(() => {
    const items = [...baseMenuItems];
    if (location.pathname === "/") {
      items.push(...authMenuItems);
    }
    return items;
  }, [location.pathname, baseMenuItems, authMenuItems]);

  return (
    <nav className="fixed top-5 left-0 right-0 z-50 bg-background/80 text-black font-['Navbar']">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-14 lg:py-2">
        <div className="flex items-center justify-between h-16 px-4 rounded-2xl bg-[#E2F2D4] backdrop-blur-xl">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold">{t("krushi_yantra")}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {location.pathname === "/" ? (
            <div className="xl:-ml-96 hidden md:flex md:items-center md:space-x-8">
              {baseMenuItems.map((item) =>
                item.action ? (
                  <button
                    key={item.text}
                    onClick={item.action}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer bg-transparent border-none"
                  >
                    {t(item.text)}
                  </button>
                ) : (
                  <Link
                    key={item.link}
                    to={item.link}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t(item.text)}
                  </Link>
                )
              )}
            </div>
          ) : null}

          <div className="flex gap-2">
            {/* Auth Buttons */}
            {location.pathname === "/" ? (
              <div className="hidden md:flex md:items-center">
                {authMenuItems.map((item) => (
                  <Button key={item.link} variant="white">
                    <Link to={item.link}>{t(item.text)}</Link>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CgProfile className="h-7 w-7" />
              </div>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden items-center justify-center p-2 rounded-md text-foreground hover:bg-black/5 transition-colors duration-200"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu with FlowingMenu */}
      {isMenuOpen && (
        <div className="md:hidden w-full p-1">
          <div className="bg-background/95 bg-green-800 h-fit flex flex-col items-center p-2 rounded-2xl">
            <div className="w-full flex flex-col gap-2">
              {baseMenuItems.map((item) =>
                item.action ? (
                  <button
                    key={item.text}
                    onClick={item.action}
                    className="block w-full text-center py-2 text-white hover:bg-green-700 rounded-lg transition duration-200"
                  >
                    {t(item.text)}
                  </button>
                ) : (
                  <Link
                    key={item.link}
                    to={item.link}
                    className="block w-full text-center py-2 text-white hover:bg-green-700 rounded-lg transition duration-200"
                  >
                    {t(item.text)}
                  </Link>
                )
              )}
              {/* Auth Buttons in Mobile Menu */}
              {authMenuItems.map((item) => (
                <Link
                  key={item.link}
                  to={item.link}
                  className="block w-full text-center py-2 text-white hover:bg-green-700 rounded-lg transition duration-200"
                >
                  {t(item.text)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
