import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { footMenu, footSocial } from "../../data/footerData";
import { TfiAngleRight } from "react-icons/tfi";
// import logo from "../../assets/header.png";
import commonContext from "../../contexts/common/commonContext";

const Footer = () => {
  const { toggleForm } = useContext(commonContext);
  const navigate = useNavigate();

  const handleClick = (menu) => {
    const usertype = localStorage.getItem("usertype");
    if (menu.requiresAuth && !usertype) {
      toggleForm(true);
      return;
    }
    navigate(menu.path);
  };

  const handleSocialClick = (item) => {
    if (item.external) {
      window.open(item.path, "_blank");
    } else {
      navigate(item.path);
    }
  };

  return (
    <footer
      id="footer"
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-100 py-12 mt-12 dark:mt-0 dark:pt-24 border-t border-sky-500/20"
    >
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_repeat(2,1fr)] gap-12 justify-items-center">
          <div>
            <Link to="/">
              <div className="flex items-center gap-2 text-xl font-bold text-sky-400 hover:text-cyan-300 transition-colors dark:text-sky-300">
                <span className="text-red-500 text-2xl">❤️</span>
                <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">AI-MedLab</span>
              </div>
            </Link>
          </div>

          {footMenu.map((item) => {
            const { id, title, menu } = item;
            return (
              <div key={id} className="text-center md:text-left">
                <h4 className="font-bold text-lg mb-4 text-sky-300 dark:text-cyan-300">
                </h4>
                <ul className="mt-6 grid gap-4 min-w-[200px]">
                  {menu.map((menuItem) => {
                    const { id, link, path } = menuItem;
                    return (
                      <li
                        key={id}
                        className="transition-all duration-300 ease-out"
                      >
                        <div className="flex items-center gap-2 hover:ml-2">
                          <TfiAngleRight className="text-sm text-sky-400/80 dark:text-cyan-400/80" />
                          <span
                            onClick={() => handleClick(menuItem)}
                            className="text-sm opacity-80 hover:opacity-100 hover:underline hover:text-sky-300 transition-transform transform hover:translate-x-1 cursor-pointer dark:text-slate-300 dark:hover:text-cyan-300"
                          >
                            {link}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t border-sky-500/20 mt-10 dark:border-sky-500/30"></div>

        <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-8 gap-8">
          <p className="text-sm text-center md:text-left dark:text-slate-400">
            <span className="opacity-80">
              {new Date().getFullYear()} @ AI-MedLab | All Rights Reserved
            </span>
          </p>
          <div className="flex gap-8 text-lg">
            {footSocial.map((item) => (
              <span
                key={item.id}
                onClick={() => handleSocialClick(item)}
                className={`cursor-pointer hover:text-cyan-300 transition-transform transform hover:scale-110 text-sky-400 dark:text-sky-300 dark:hover:text-cyan-300 ${item.cls}`}
              >
                {item.icon}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
