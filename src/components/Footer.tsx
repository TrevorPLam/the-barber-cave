import { Scissors } from 'lucide-react';
import { BUSINESS_INFO } from '@/data/constants';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
              <Scissors className="h-5 w-5 text-black" />
            </div>
            <span className="text-lg font-bold">{BUSINESS_INFO.name}</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400">© 2024 {BUSINESS_INFO.name}. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-1">Serving Dallas with style and precision</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
