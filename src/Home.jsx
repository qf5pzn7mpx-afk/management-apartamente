import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <Hero onStart={() => navigate('/login')} onDemo={() => navigate('/contact')} />
    </div>
  );
}
