import React from 'react';
import { Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-10 bg-white border-t border-naver-border mt-auto">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-naver-muted text-sm font-medium">
          © 2026 <span className="text-naver-text font-bold">Zoops</span> | Created by <span className="text-naver-green font-bold">Zoops</span>
        </div>
      </div>
    </footer>
  );
};