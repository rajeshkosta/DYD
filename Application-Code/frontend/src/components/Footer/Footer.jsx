import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Link2Icon } from "lucide-react";
import "./Footer.css";
import logo from "../../assets/img/logo.svg";

const Footer = () => {
  return (
    <footer className=" text-white ">
      <div className="  bg-[#09122C] py-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
          {/* Left Section */}
          <div >
            <img src={logo} className="w-52" alt="logo" />
            <p className="text-base font-light mt-4 text-[#D2D2D2]">
              Channel your inspiration and make your own t-shirt with Printify in a few simple steps.
            </p>
          </div>

          {/* Useful Links */}
          <div className="flex justify-start md:justify-center">
            <div>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li>Find us:</li>
                <p>
                  H-190, Sector-63, Noida
                  U.P. (201301)
                </p>

                <li>Call us on:</li>
                <p>+91 9717992260</p>
                <li>DM us on:</li>
                <p>
                  info@niotek.in
                </p>
              </ul>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex md:justify-center justify-start">
            <div>
              <h3 className="text-lg font-semibold">Social media Links</h3>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li className="flex items-center gap-3">
                  <i className="fa-brands fa-facebook facebook-icon"></i>
                  <a href="#" className="text-lg">Facebook</a>
                </li>
                <li className="flex items-center gap-3">
                  <Instagram size={18} className="instagram-icon" />
                  <a href="#" className="text-lg">Instagram</a>
                </li>
                <li className="flex items-center gap-3">
                  <Twitter size={18} className="twitter-icon" />
                  <a href="#" className="text-lg">Twitter</a>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-brands fa-linkedin linkedin-icon"></i>
                  <a href="#" className="text-lg">LinkedIn</a>
                </li>
              </ul>
            </div>
          </div>
        </div>


      </div>

      {/* Bottom Section */}
      <div className="bg-gray-700 text-center text-gray-300 py-4 ">
        Copyright© 2023 Dscode | All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
