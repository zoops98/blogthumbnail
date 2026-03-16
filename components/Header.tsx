import React from 'react';
import { MonitorPlay, HelpCircle, Key } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp }) => {
  const handleOpenKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    } else {
      alert("이 기능은 AI Studio 환경에서만 작동합니다. 배포 시에는 환경 변수(API_KEY)를 설정해주세요.");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-naver-border shadow-sm">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-naver-text font-black text-2xl tracking-tight cursor-pointer select-none" onClick={() => window.location.reload()}>
          <MonitorPlay className="text-naver-green w-8 h-8" />
          <span>Zoops</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-[11px] font-bold text-naver-muted border border-naver-border px-3 py-1 rounded-full bg-naver-light uppercase tracking-wider">
            Powered by Gemini
          </div>
          
          <button 
            onClick={handleOpenKey}
            className="p-2 text-naver-muted hover:text-naver-green hover:bg-naver-light rounded-full transition-all"
            title="API 키 설정"
          >
            <Key className="w-6 h-6" />
          </button>

          <button 
            onClick={onOpenHelp}
            className="p-2 text-naver-muted hover:text-naver-green hover:bg-naver-light rounded-full transition-all"
            title="사용법 도움말"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
