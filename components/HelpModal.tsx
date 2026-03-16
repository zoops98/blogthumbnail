import React from 'react';
import { X, FileText, User, Users, Sparkles, Image as ImageIcon, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white border border-naver-border rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-elevated animate-slide-up max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-naver-light/30 px-10 py-8 border-b border-naver-border flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-black flex items-center gap-3 text-naver-text tracking-tight">
            <HelpCircle className="text-naver-green w-7 h-7" />
            Zoops 사용 가이드
          </h2>
          <button 
            onClick={onClose} 
            className="p-3 rounded-xl hover:bg-naver-light text-naver-muted hover:text-naver-text transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
          <div className="space-y-10">
            <div className="flex gap-6 group">
              <div className="bg-naver-light w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <span className="text-naver-green font-black text-xl">01</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-naver-text mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-naver-green" /> 주제 입력 및 분석
                </h3>
                <p className="text-naver-muted text-sm leading-relaxed font-medium">
                  블로그 포스팅의 주제나 내용을 입력하세요. 관련 문서를 업로드하면 AI가 내용을 분석하여 최적의 키워드를 추출합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-6 group">
              <div className="bg-naver-light w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <span className="text-naver-green font-black text-xl">02</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-naver-text mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-naver-green" /> 타겟 독자 선택
                </h3>
                <p className="text-naver-muted text-sm leading-relaxed font-medium">
                  정보 전달형, 감성형 등 포스팅의 성격에 맞는 독자층을 선택하세요. 타겟에 맞춰 디자인 스타일이 결정됩니다.
                </p>
              </div>
            </div>

            <div className="flex gap-6 group">
              <div className="bg-naver-light w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <span className="text-naver-green font-black text-xl">03</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-naver-text mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-naver-green" /> 전략 수정 및 생성
                </h3>
                <p className="text-naver-muted text-sm leading-relaxed font-medium">
                  AI가 제안한 문구와 스타일을 확인하고 필요시 수정하세요. '생성하기' 버튼을 누르면 2종의 썸네일이 제작됩니다.
                </p>
              </div>
            </div>

            <div className="flex gap-6 group">
              <div className="bg-naver-light w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <span className="text-naver-green font-black text-xl">04</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-naver-text mb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-naver-green" /> 저장 및 부분 수정
                </h3>
                <p className="text-naver-muted text-sm leading-relaxed font-medium">
                  최종 이미지가 생성되면 JPG로 저장하거나, 마음에 들지 않는 부분을 텍스트로 입력하여 AI에게 부분 수정을 요청할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-naver-light/50 p-6 rounded-3xl border border-naver-border">
            <h4 className="text-[10px] font-black text-naver-muted uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-naver-green" /> Tip
            </h4>
            <p className="text-sm text-naver-text font-medium leading-relaxed">
              블로그명(브랜딩)을 추가하면 더욱 전문적인 느낌의 썸네일을 만들 수 있습니다. 생성된 이미지는 JPG 형식으로 저장 가능합니다.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-5 bg-naver-green text-white rounded-2xl font-black text-xl hover:bg-naver-darkGreen transition-all shadow-green-glow hover:-translate-y-1 active:translate-y-0"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
