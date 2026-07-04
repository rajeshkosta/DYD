import { Button } from 'antd';
import imgae from "../assets/img/image3.png"
import "../assets/styles/theme.css"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import '../assets/styles/style.css';

const Promotion = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/editor');
    } else {
      message.error('Please log in to start designing your t-shirt.');
    }
  }

  return (
    <section className="flex flex-col md:flex-row w-full bg-[#FAFFEC] min-h-screen">
      {/* Left Image Side */}
      <div className="w-full md:w-[45%] h-full bg-[#B2C2A2] overflow-hidden flex items-center justify-center">
        <img
          src={imgae}
          alt="Custom t-shirt design"
          className="w-full h-full object-cover"
        />
      </div>


      {/* Right Text Side */}
      <div className="w-full md:w-[55%]  flex items-center">
        <div className="px-6 md:px-16 py-12 md:py-0">
          <h1 className="text-4xl md:text-7xl font-extrabold text-[#293702] leading-tight mb-6">
            UNLEASH YOUR <br />
            STYLE WITH AI DRIP
          </h1>

          <p className="text-base md:text-lg  mb-6">
            Welcome to DYD – Design Your Drip, where fashion meets the future. Create your own one-of-a-kind T-shirts with the power of AI. Just type a prompt, and boom — your drip is born. No limits. No rules. Just your vibe, your way.
          </p>

          <p className="text-base md:text-lg  mb-8">
            Whether you're into bold streetwear, clean minimalism, or something totally out there, DYD helps you flex your unique style without lifting more than a finger.
          </p>

          <button
            size="large"
            className="bg-accent hover:bg-[#00a0cc] text-white text-base font-semibold px-6 py-3 rounded-md border-none"
            onClick={handleStart}
          >
            Design Your Drip Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Promotion;