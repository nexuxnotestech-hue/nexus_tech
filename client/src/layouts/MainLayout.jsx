import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-textWhite font-sans selection:bg-primary/30 selection:text-white">
      <Navbar />
      <main className="flex-grow flex flex-col mb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
