// import { Button } from 'antd';
import Design from "../assets/img/Design.svg"
import "../assets/styles/theme.css"
import "../assets/styles/style.css"
import DRIP from "../assets/img/DRIP.svg"
import person from "../assets/img/header.png"
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { message } from 'antd';
const Hero = () => {
  // const  isAuthenticated  = useSelector((state) => state.auth.isAuthenticated);
  // const navigate = useNavigate();
  // const handleStart = () => {
  //     if (isAuthenticated) {
  //         navigate('/editor');
  //     } else {
  //         message.error('Please log in to start designing your t-shirt.');
  //     }
  // }


  return (
    <div className="relative bg-primary  lg:min-h-screen flex items-center justify-center overflow-hidden ">

      {/* Content container */}
      <div className="container mx-auto  relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side - Large text overlay */}
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
            <div className="flex flex-col">
              <div className="px-8 mb-6">
                <img src={Design} alt="" />
              </div>

              <div className="px-8">
                <img src={DRIP} alt="" />
              </div>
            </div>
          </div>

          {/* Person image - centered */}
          <div className="flex-1 relative z-20 mt-20 md:mt-0">
            <div className="flex justify-center">
              <div className="relative mt-16">
                <img
                  src={person}
                  alt="Person in green cap and shirt using phone"
                  className="w-60  md:w-80 lg:w-full  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;