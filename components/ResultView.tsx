import React, { useState } from 'react';
import { Download, RefreshCw, ArrowLeft, Wand2, Sparkles } from 'lucide-react';

interface ResultViewProps {
  imageUrls: string[];
  onReset: () => void;
  onRegenerate: () => void;
  onEditImage: (index: number, instruction: string) => void;
  isEditing: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({ imageUrls, onReset, onRegenerate, onEditImage, isEditing }) => {
  // State to manage edit prompt inputs for each image independently
  const [editPrompts, setEditPrompts] = useState<string[]>(new Array(imageUrls.length).fill(''));

  const handlePromptChange = (index: number, value: string) => {
    const newPrompts = [...editPrompts];
    newPrompts[index] = value;
    setEditPrompts(newPrompts);
  };

  const handleEditClick = (index: number) => {
    if (editPrompts[index].trim()) {
      onEditImage(index, editPrompts[index]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditClick(index);
    }
  };

  const handleDownloadJpg = (url: string, index: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw white background to ensure no transparency issues (JPG doesn't support transparency)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // Convert to JPG
        const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
        
        const link = document.createElement('a');
        link.href = jpgUrl;
        link.download = `thumbnail_option_${index === 0 ? 'A' : 'B'}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    img.src = url;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-white border border-naver-border rounded-[2.5rem] overflow-hidden shadow-elevated">
        
        {/* Header */}
        <div className="bg-naver-light/30 px-10 py-8 border-b border-naver-border flex items-center justify-between">
          <h2 className="text-3xl font-black flex items-center gap-3 text-naver-text tracking-tight">
            <Sparkles className="text-naver-green w-8 h-8 animate-pulse-slow" />
            썸네일 생성 완료
          </h2>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-naver-border text-naver-muted hover:text-naver-green hover:border-naver-green transition-all font-bold text-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            처음으로
          </button>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {imageUrls.map((url, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col animate-slide-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Image Card */}
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-elevated border-4 border-white group-hover:border-naver-green/30 transition-all duration-500 group-hover:scale-[1.02] bg-naver-light">
                  <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-lg">
                    <span className="text-xs font-black text-naver-text tracking-widest uppercase">
                      Option {idx === 0 ? 'A' : 'B'}
                    </span>
                  </div>
                  <img 
                    src={url} 
                    alt={`Generated Thumbnail Option ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Edit Loading Overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                       <div className="w-12 h-12 border-4 border-naver-green/20 border-t-naver-green rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Download Button */}
                <button
                  onClick={() => handleDownloadJpg(url, idx)}
                  className="mt-8 w-full flex items-center justify-center gap-3 bg-naver-green text-white px-8 py-5 rounded-2xl font-black text-xl hover:bg-naver-darkGreen transition-all shadow-green-glow hover:-translate-y-1 active:translate-y-0"
                >
                  <Download className="w-6 h-6" />
                  Option {idx === 0 ? 'A' : 'B'} 저장 (JPG)
                </button>

                {/* Edit Input Section */}
                <div className="mt-6 bg-naver-light/30 p-6 rounded-3xl border border-naver-border shadow-inner">
                  <label className="text-[10px] font-black text-naver-muted mb-4 block flex items-center gap-2 uppercase tracking-[0.15em] ml-1">
                    <Wand2 className="w-4 h-4 text-naver-green" /> AI 부분 수정 요청
                  </label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={editPrompts[idx]}
                      onChange={(e) => handlePromptChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      placeholder="예: 텍스트를 노란색으로 바꿔줘..."
                      disabled={isEditing}
                      className="flex-1 bg-white text-base text-naver-text px-6 py-4 rounded-xl border border-naver-border focus:border-naver-green outline-none placeholder-gray-300 font-bold shadow-sm"
                    />
                    <button
                      onClick={() => handleEditClick(idx)}
                      disabled={isEditing || !editPrompts[idx].trim()}
                      className="bg-white border-2 border-naver-border text-naver-text hover:border-naver-green hover:text-naver-green disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-200 px-8 py-4 rounded-xl text-base font-black transition-all whitespace-nowrap shadow-sm hover:shadow-md"
                    >
                      수정
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-8 pt-12 border-t border-naver-border">
            <div className="text-naver-muted text-sm font-bold flex items-center gap-3 bg-naver-light/50 px-8 py-3 rounded-full border border-naver-border">
               <Sparkles className="w-5 h-5 text-naver-green" />
               <span>마음에 드는 결과가 없나요? 전체 설정을 다시 제안받아보세요.</span>
            </div>
            
            <button
              onClick={onRegenerate}
              className="px-12 py-5 bg-white border-2 border-naver-border hover:border-naver-green text-naver-muted hover:text-naver-green rounded-2xl font-black text-xl flex items-center gap-4 transition-all shadow-soft hover:shadow-elevated hover:-translate-y-1 active:translate-y-0"
            >
              <RefreshCw className="w-6 h-6" />
              전체 다시 만들기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
