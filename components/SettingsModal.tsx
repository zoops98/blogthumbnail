import React from 'react';
import { X, Key } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-yt-red" />
            API 키 설정
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <p className="text-gray-300 text-sm leading-relaxed">
              이 애플리케이션은 <strong>Google AI Studio</strong> 및 환경 변수를 통해 인증을 관리합니다.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              별도의 API 키 입력이 필요하지 않습니다.
            </p>
          </div>
          
          <div className="text-center pt-2 border-t border-gray-700 mt-4">
             <button 
               onClick={onClose}
               className="text-gray-500 text-sm hover:text-white transition-colors mt-2"
             >
               닫기
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};