import { Button, message } from 'antd';
import image from "../assets/img/image2.png"
import "../assets/styles/theme.css"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// const steps = [
//     {
//         number: 1,
//         title: 'Browse the design',
//         description: 'Choose from our collection or upload your own design'
//     },
//     {
//         number: 2,
//         title: 'Place to t-shirt',
//         description: 'Select your preferred t-shirt style and placement'
//     },
//     {
//         number: 3,
//         title: 'Deliver your door step',
//         description: 'Fast and reliable shipping to your location'
//     }
// ];



const HowToDesign = () => {
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
                    src={image}
                    alt="Custom t-shirt design"
                    className="w-full h-full object-cover"
                />
            </div>


            {/* Right Text Side */}
            <div className="w-full md:w-[55%]  flex items-center">
                <div className="px-6 md:px-16 py-12 md:py-0">
                    <h1 className="text-4xl md:text-8xl font-normal text-[#293702] leading-tight mb-6">
                        T-SHIRTS
                        BUILT DIFFERENT
                        DESIGNED BY YOU
                    </h1>

                    <p className="text-base md:text-lg  mb-6">
                        At DYD (Design Your Drip), tees aren't just clothes — they're a canvas for your wildest ideas. Fire up the AI, drop a crazy prompt, and boom — your custom T-shirt is born. Funky, bold, loud, or minimal — it’s your vibe, your rules.
                    </p>

                    <div className="flex flex-wrap gap-2 justify-start mt-6">
                        <span className="px-4 py-2 bg-secendory/5 text-secendory text-sm rounded-full">One-of-One Designs</span>
                        <span className="px-4 py-2 bg-secendory/5 text-secendory text-sm rounded-full">AI-Powered Creativity</span>
                        <span className="px-4 py-2 bg-secendory/5 text-secendory text-sm rounded-full">Drippy Fit. Luxe Feel. All Day.</span>
                    </div>

                    <div className='mt-10'>
                    <button
                        size="large"
                        className="bg-accent hover:bg-[#00a0cc] text-white text-base font-semibold px-6 py-3  rounded-md border-none"
                        onClick={handleStart}
                    >
                        Design Your Drip Now
                    </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowToDesign;