'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiMapPin, FiDollarSign } from 'react-icons/fi';

export default function Hero() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <section className="relative h-[65vh] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
      
      {/* Visual Overlay Graphic / Background Image Placeholder */}
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-60 transition-scale duration-700 hover:scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80')` 
        }}
      />

      {/* Main Content Box Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <span className="inline-block bg-sky-500/20 text-sky-400 font-semibold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm mb-4">
          Discover The Unexplored
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Your Next Grand Adventure Awaits
        </h1>
        <p className="text-base md:text-lg text-slate-200 max-w-xl mx-auto mb-8">
          Explore customized, professionally guided tours across breathtaking global destinations. 
        </p>

        {/* Interactive Search Engine Overlay Panel */}
        <form 
          onSubmit={handleSearchSubmit}
          className="bg-white p-3 md:p-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col md:flex-row gap-3 items-center max-w-3xl mx-auto text-slate-800"
        >
          {/* Destination Text Input Search */}
          <div className="flex items-center gap-2 w-full px-2 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0">
            <FiMapPin className="text-sky-500 shrink-0" size={18} />
            <input 
              type="text" 
              placeholder="Where do you want to go?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-sm placeholder-slate-400 text-slate-800"
            />
          </div>

          {/* Category Dropdown Selection Select Input */}
          <div className="flex items-center gap-2 w-full px-2 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0">
            <FiSearch className="text-sky-500 shrink-0" size={18} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-sm text-slate-700 cursor-pointer appearance-none"
            >
              <option value="">All Categories</option>
              <option value="Hiking">Hiking & Mountaineering</option>
              <option value="Beach">Beach & Tropical</option>
              <option value="Cultural">Cultural Experiences</option>
              <option value="City Break">City Break Escapes</option>
            </select>
          </div>

          {/* Submit Action Button */}
          <button 
            type="submit"
            className="w-full md:w-auto shrink-0 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            Explore Now
          </button>
        </form>
      </div>
    </section>
  );
}