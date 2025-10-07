import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import useFirstAidStore from '../../store/firstaid';
import Navbar from '../../Components/Navbar/Navbar';

export default function FirstAid() {
  const { getAllStatusNames } = useFirstAidStore();
  const [cardTitles, setCardTitles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getTitles = async () => {
    try {
      const titles = await getAllStatusNames();
      setCardTitles(titles || []);
    } catch (err) {
      console.error('Error loading titles:', err);
      setCardTitles([]);
    }
  };

  useEffect(() => {
    getTitles();
  }, []);

  const filteredTitles = cardTitles.filter(title =>
    (title.name || title).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />

      {/* Fixed Search Bar */}
      <div className="fixed top-[56px] left-0 w-full z-40 py-2 px-4 bg-white shadow-md">
        <form className="flex items-center max-w-2xl mx-auto py-1">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 bg-white border border-[var(--color-primary)] text-gray-800 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] ps-4 p-2.5 placeholder-gray-500"
            placeholder="ابحث باسم الإصابة"
            dir="rtl"
          />

          <button
            type="submit"
            onClick={e => e.preventDefault()}
            className="ms-2 inline-flex items-center py-2.5 px-4 text-sm font-medium text-white"
            style={{
              backgroundColor: 'var(--color-primary)',
              borderRadius: '8px',
            }}
          >
            بحث
            <svg
              className="w-4 h-4 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-8 mt-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredTitles.map((title, index) => (
            <Card key={index} title={title.name || title} id={title.key} />
          ))}
        </div>

        {filteredTitles.length === 0 && <p className="text-center text-gray-500 mt-10">لا توجد نتائج مطابقة</p>}
      </div>
    </>
  );
}
