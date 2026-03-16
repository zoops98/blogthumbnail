import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('ZOOP_GEMINI_API_KEY') || '';
      setApiKey(savedKey);
      setIsSaved(false);
      setError('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('API 키를 입력해주세요.');
      return;
    }
    
    // Basic validation for Gemini API key (usually starts with AIza)
    if (!apiKey.startsWith('AIza')) {
      setError('올바른 Gemini API 키 형식이 아닌 것 같습니다. 다시 확인해주세요.');
      return;
    }

    localStorage.setItem('ZOOP_GEMINI_API_KEY', apiKey.trim());
    setIsSaved(true);
    setError('');
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleRemove = () => {
    localStorage.removeItem('ZOOP_GEMINI_API_KEY');
    setApiKey('');
    setIsSaved(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white border border-naver-border rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-elevated animate-slide-up flex flex-col">
        
        {/* Header */}
        <div className="bg-naver-light/30 px-8 py-6 border-b border-naver-border flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black flex items-center gap-3 text-naver-text tracking-tight">
            <Key className="text-naver-green w-6 h-6" />
            API 키 설정
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-naver-light text-naver-muted hover:text-naver-text transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <p className="text-naver-muted text-sm font-medium leading-relaxed">
              Gemini API 키를 입력하여 서비스를 이용할 수 있습니다. 입력하신 키는 브라우저의 로컬 스토리지에만 안전하게 저장됩니다.
            </p>
            
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                  setIsSaved(false);
                }}
                placeholder="AIza..."
                className={`w-full px-5 py-4 bg-naver-light border ${error ? 'border-red-400' : 'border-naver-border'} rounded-2xl text-naver-text font-medium focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-100' : 'focus:ring-naver-green/20'} transition-all`}
              />
              {isSaved && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-naver-green flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-bold">저장됨</span>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`w-full py-4 ${isSaved ? 'bg-naver-green/50 cursor-default' : 'bg-naver-green hover:bg-naver-darkGreen'} text-white rounded-2xl font-black text-lg transition-all shadow-green-glow flex items-center justify-center gap-2`}
            >
              {isSaved ? '저장 완료' : '설정 저장하기'}
            </button>
            
            {localStorage.getItem('ZOOP_GEMINI_API_KEY') && (
              <button
                onClick={handleRemove}
                className="w-full py-3 text-naver-muted hover:text-red-500 text-sm font-bold transition-all"
              >
                저장된 키 삭제하기
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-naver-border">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-naver-muted hover:text-naver-green text-xs font-bold transition-all"
            >
              Gemini API 키가 없으신가요? 여기서 무료로 받기
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
