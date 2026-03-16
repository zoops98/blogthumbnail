
import React, { useState } from 'react';
import { StrategyResponse, BorderStyle } from '../types';
import { Sparkles, Copy, Image as ImageIcon, AlertCircle, Palette, ArrowRight, Frame, Monitor, Ban, PenTool, Zap } from 'lucide-react';

interface StrategyViewProps {
  strategy: StrategyResponse;
  isLoadingImage: boolean;
  onGenerateImage: (
    prompt: string,
    opt1: { main: string; sub: string; style: string },
    opt2: { main: string; sub: string; style: string },
    options: { borderStyle: BorderStyle; channelName?: string }
  ) => void;
}

export const StrategyView: React.FC<StrategyViewProps> = ({ strategy, isLoadingImage, onGenerateImage }) => {
  // Option 1 State
  const [opt1Main, setOpt1Main] = useState(strategy.option1.hookMainText);
  const [opt1Sub, setOpt1Sub] = useState(strategy.option1.hookSubText);

  // Option 2 State
  const [opt2Main, setOpt2Main] = useState(strategy.option2.hookMainText);
  const [opt2Sub, setOpt2Sub] = useState(strategy.option2.hookSubText);

  // Additional Visual Options
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('none');
  const [useChannelName, setUseChannelName] = useState<boolean>(false);
  const [channelName, setChannelName] = useState<string>('');
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(strategy.imagePromptKo || strategy.imagePrompt);
  };

  const handleGenerateClick = () => {
    onGenerateImage(
      strategy.imagePrompt,
      { main: opt1Main, sub: opt1Sub, style: strategy.option1.textStyleSuggestion },
      { main: opt2Main, sub: opt2Sub, style: strategy.option2.textStyleSuggestion },
      { borderStyle, channelName: useChannelName ? channelName : undefined }
    );
  };

  const borderOptions: { id: BorderStyle; label: string; icon: React.ReactNode }[] = [
    { id: 'none', label: '없음', icon: <Ban className="w-4 h-4" /> },
    { id: 'solid', label: '단색 강조', icon: <Frame className="w-4 h-4" /> },
    { id: 'neon', label: '네온 글로우', icon: <Zap className="w-4 h-4" /> },
    { id: 'sketch', label: '손그림/낙서', icon: <PenTool className="w-4 h-4" /> },
  ];

  const renderOptionCard = (
    title: string,
    label: string,
    mainText: string, 
    setMain: (s: string) => void, 
    subText: string, 
    setSub: (s: string) => void,
    suggestion: string,
    colorClass: string
  ) => (
    <div className="flex-1 bg-white p-8 rounded-3xl border border-naver-border relative overflow-hidden flex flex-col h-full shadow-soft transition-all duration-500 hover:shadow-elevated hover:border-naver-green/30 group">
      <div className={`absolute top-0 left-0 w-full h-2 ${colorClass} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
      
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-black text-xl text-naver-text flex items-center gap-3">
          {title} <span className="text-[10px] px-3 py-1 rounded-full bg-naver-light text-naver-muted border border-naver-border font-black uppercase tracking-wider">{label}</span>
        </h4>
      </div>

      <div className="flex items-start gap-3 text-xs text-naver-muted bg-naver-light/50 p-4 rounded-2xl mb-8 border border-naver-border/50 font-medium leading-relaxed">
        <Palette className="w-4 h-4 mt-0.5 flex-shrink-0 text-naver-green" />
        <span>{suggestion}</span>
      </div>

      <div className="space-y-6 flex-grow">
        <div className="space-y-3">
          <label className="text-[10px] text-naver-muted font-black uppercase tracking-[0.15em] ml-1">메인 문구 (Main)</label>
          <input 
            type="text" 
            value={mainText}
            onChange={(e) => setMain(e.target.value)}
            className="w-full bg-naver-light/30 text-2xl font-black text-naver-text text-center p-6 rounded-2xl border border-naver-border focus:border-naver-green focus:bg-white outline-none transition-all placeholder-gray-300 shadow-inner"
            placeholder="메인 문구 입력"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] text-naver-muted font-black uppercase tracking-[0.15em] ml-1">서브 문구 (Sub)</label>
          <input 
            type="text" 
            value={subText}
            onChange={(e) => setSub(e.target.value)}
            className="w-full bg-naver-light/30 text-lg font-bold text-naver-muted text-center p-5 rounded-2xl border border-naver-border focus:border-naver-green focus:bg-white outline-none transition-all placeholder-gray-300 shadow-inner"
            placeholder="서브 문구 입력"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-white border border-naver-border rounded-[2.5rem] overflow-hidden shadow-elevated">
        
        {/* Header */}
        <div className="bg-naver-light/30 px-10 py-8 border-b border-naver-border">
          <h2 className="text-3xl font-black flex items-center gap-3 text-naver-text tracking-tight">
            <Sparkles className="text-naver-green w-8 h-8 animate-pulse-slow" />
            썸네일 전략 제안
          </h2>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          {/* Strategy Summary */}
          <div className="bg-naver-light/50 p-8 rounded-3xl border border-naver-border text-naver-text leading-relaxed font-medium text-lg shadow-inner">
            <h3 className="text-[11px] font-black text-naver-muted uppercase tracking-[0.2em] mb-4">전략 분석 요약</h3>
            {strategy.strategySummary}
          </div>

          {/* Dual Option Editor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderOptionCard(
              "Option A", 
              strategy.option1.label,
              opt1Main, setOpt1Main, 
              opt1Sub, setOpt1Sub, 
              strategy.option1.textStyleSuggestion,
              "bg-blue-500"
            )}
            {renderOptionCard(
              "Option B", 
              strategy.option2.label,
              opt2Main, setOpt2Main, 
              opt2Sub, setOpt2Sub, 
              strategy.option2.textStyleSuggestion,
              "bg-naver-green"
            )}
          </div>

          {/* Additional Options */}
          <div className="bg-naver-light/20 p-8 rounded-3xl border border-naver-border">
            <h3 className="text-[11px] font-black text-naver-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-naver-green" /> 추가 스타일 설정
            </h3>
            <div className="flex flex-col lg:flex-row gap-12">
              
              {/* Border Selector */}
              <div className="flex-1">
                <label className="text-[10px] font-black text-naver-muted mb-4 block uppercase tracking-widest">테두리 스타일</label>
                <div className="flex flex-wrap gap-3">
                  {borderOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setBorderStyle(option.id)}
                      className={`
                        flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-bold transition-all border shadow-sm
                        ${borderStyle === option.id 
                          ? 'bg-naver-green text-white border-naver-green shadow-green-glow scale-105' 
                          : 'bg-white text-naver-muted border-naver-border hover:border-naver-green hover:text-naver-green'}
                      `}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel Name Toggle */}
              <div className="flex-1">
                <label className="text-[10px] font-black text-naver-muted mb-4 block uppercase tracking-widest">브랜딩</label>
                <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 ${useChannelName ? 'bg-naver-green border-naver-green shadow-green-glow' : 'bg-white border-naver-border group-hover:border-naver-green shadow-sm'}`}>
                      {useChannelName && <Monitor className="w-5 h-5 text-white" />}
                    </div>
                    <input type="checkbox" checked={useChannelName} onChange={(e) => setUseChannelName(e.target.checked)} className="hidden" />
                    <span className={`font-black text-base ${useChannelName ? 'text-naver-text' : 'text-naver-muted'}`}>블로그명 표시</span>
                  </label>
                  
                  {useChannelName && (
                    <input 
                      type="text" 
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="블로그명 입력"
                      className="bg-white border border-naver-border rounded-xl px-6 py-3 text-base text-naver-text focus:border-naver-green outline-none animate-fade-in w-full sm:w-auto font-bold shadow-inner"
                    />
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Base Prompt Info */}
          <div className="bg-naver-light/30 p-5 rounded-2xl border border-naver-border flex items-center justify-between gap-6">
             <div className="flex-1 overflow-hidden">
                <div className="text-[10px] font-black text-naver-muted uppercase mb-1 tracking-widest">이미지 프롬프트 (Korean)</div>
                <div className="text-xs text-naver-muted truncate font-mono opacity-60">{strategy.imagePromptKo || strategy.imagePrompt}</div>
             </div>
             <button onClick={copyToClipboard} className="bg-white p-3 rounded-xl border border-naver-border text-naver-muted hover:text-naver-green hover:border-naver-green transition-all shadow-sm hover:shadow-md">
               <Copy className="w-4 h-4" />
             </button>
          </div>

          {/* Action Area */}
          <div className="pt-10 border-t border-naver-border">
            <div className="flex flex-col items-center gap-6">
              <div className="text-naver-muted text-sm font-bold flex items-center gap-3 bg-naver-light/50 px-6 py-2 rounded-full border border-naver-border">
                 <AlertCircle className="w-5 h-5 text-naver-green" />
                 <span>두 가지 버전의 이미지가 동시에 생성됩니다 (약 20초 소요)</span>
              </div>
              
              <button
                onClick={handleGenerateClick}
                disabled={isLoadingImage || (useChannelName && !channelName.trim())}
                className={`
                  w-full md:w-auto min-w-[400px] flex items-center justify-center gap-4 px-12 py-6 rounded-2xl font-black text-2xl transition-all shadow-elevated
                  ${isLoadingImage || (useChannelName && !channelName.trim())
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-naver-green text-white hover:bg-naver-darkGreen hover:shadow-green-glow hover:-translate-y-1 active:translate-y-0'}
                `}
              >
                {isLoadingImage ? (
                  <>
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    2종 썸네일 생성 중...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8" />
                    썸네일 2종 생성하기
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
