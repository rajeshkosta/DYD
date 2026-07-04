import Hero from '../components/Hero';
import Promotion from '../components/Promotion';
import Slider from '../components/Slider/Slider';
import HowToDesign from '../components/HowToDesign';
import About from '../components/about/About';

const Home = () => {
  return (
    <main className="w-full">
      <Hero />
      <Promotion />
      <About />
      <Slider />
      <HowToDesign />
    </main>
  );
};

export default Home;