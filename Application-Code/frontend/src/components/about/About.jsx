import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from 'antd';

const About = () => {
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
        <section className="py-16 md:py-0 lg:min-h-screen flex items-center justify-center overflow-hidden ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                <div className="  mx-auto">
                    <h1 className="text-4xl md:text-8xl font-normal text-[#2F3E1F] ">
                        T-SHIRTS BUILT BY
                    </h1>

                    <h1 className="text-4xl md:text-8xl font-normal mt-6 text-[#2F3E1F] ">
                        YOU,POWERED BY AI
                       
                    </h1>
                </div>

                <div className="text-center">
                    <p className="text-base md:text-lg mt-6">
                        This ain’t your average tee. At DYD, you drop the prompt, we bring the drip. <br />
                        Your imagination + our AI = fire T-shirts that no one else has. <br />
                        It’s not just fashion — it’s self-expression on another level.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mt-6">
                    <span className="px-4 py-2 bg-secendory/5 text-secendory text-sm rounded-full">Design with Words</span>
                    <span className="px-4 py-2 bg-secendory/5 text-secendory text-sm rounded-full">AI-Generated, You-Approved</span>
                    <span className="px-4 py-2 bg-secendory/5 text-secendory text-sm rounded-full">Comfort Fit. Quality Fabric. Always</span>
                </div>

                <div className="mt-20 flex justify-center">
                    <button onClick={handleStart} className="bg-accent hover:bg-[#009ddc] text-white font-semibold px-6 py-3 rounded-md transition duration-300">
                        Start Designing Now
                    </button>
                </div>
            </div>
        </section>
    );
};

export default About;
