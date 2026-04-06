import Hero from '../components/Hero';
import About from '../components/sections/About';
import Members from '../components/sections/Members';
import Events from '../components/sections/Events';
import Projects from '../components/sections/Projects';
import Research from '../components/sections/Research';
import Achievements from '../components/sections/Achievements';
import GameDev from '../components/sections/GameDev';
import Quest from '../components/sections/Quest';

const Home = () => {
    return (
        <div className="home-page">
            <Hero />
            <About />
            <Members />
            <Events />
            <Projects />
            <Research />
            <Achievements />
            <GameDev />
            <Quest />
        </div>
    );
};

export default Home;
