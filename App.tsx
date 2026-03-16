import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TopicInput } from './components/TopicInput';
import { AudienceSelector } from './components/AudienceSelector';
import { CharacterSettings } from './components/CharacterSettings';
import { StrategyView } from './components/StrategyView';
import { ResultView } from './components/ResultView';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { AppStep, TargetAudience, StrategyResponse, UploadedFile, CharacterConfig, BorderStyle } from './types';
import { ensureApiKey, generateThumbnailStrategy, generateThumbnailImage, editThumbnailImage } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.TOPIC);
  
  // Data State
  const [topic, setTopic] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>({ include: true, type: 'person' });
  const [audience, setAudience] = useState<TargetAudience | null>(null);
  
  const [strategy, setStrategy] = useState<StrategyResponse | null>(null);
  
  // Changed to array to support multiple results
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modals State
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Initial API key check (Built-in selection)
    ensureApiKey().catch(err => {
      console.log("Waiting for user action or built-in key");
    });
  }, []);

  const handleTopicSubmit = useCallback((inputTopic: string, file: UploadedFile | null) => {
    setTopic(inputTopic);
    setUploadedFile(file);
    setStep(AppStep.CHARACTER); // Go to Character Settings first
  }, []);

  const handleCharacterSubmit = useCallback((config: CharacterConfig) => {
    setCharacterConfig(config);
    setStep(AppStep.AUDIENCE);
  }, []);

  const handleAudienceSelect = useCallback(async (selectedAudience: TargetAudience) => {
    setAudience(selectedAudience);
    setIsLoading(true);
    setError(null);
    
    try {
      await ensureApiKey();
      // Pass file content and character config to strategy generation
      const fileContent = uploadedFile ? uploadedFile.content : null;
      const result = await generateThumbnailStrategy(topic, fileContent, selectedAudience, characterConfig);
      
      setStrategy(result);
      setStep(AppStep.STRATEGY);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "전략 생성 중 오류가 발생했습니다. API 설정을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [topic, uploadedFile, characterConfig]);

  // Updated handler for dual generation with visual options
  const handleGenerateImage = useCallback(async (
    prompt: string, 
    opt1: { main: string; sub: string; style: string },
    opt2: { main: string; sub: string; style: string },
    options: { borderStyle: BorderStyle; channelName?: string }
  ) => {
    if (!audience) return;
    
    setIsLoading(true);
    setError(null);
    setImageUrls([]);

    try {
      await ensureApiKey();
      
      // Generate both images in parallel
      const promises = [
        generateThumbnailImage(prompt, opt1.main, opt1.sub, audience, opt1.style, options.borderStyle, options.channelName),
        generateThumbnailImage(prompt, opt2.main, opt2.sub, audience, opt2.style, options.borderStyle, options.channelName)
      ];

      const results = await Promise.all(promises);
      setImageUrls(results);
      setStep(AppStep.IMAGE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [audience]);

  const handleEditImage = useCallback(async (index: number, instruction: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await ensureApiKey();
      const currentImage = imageUrls[index];
      const newImage = await editThumbnailImage(currentImage, instruction);
      
      // Update the specific image in the array
      const newImageUrls = [...imageUrls];
      newImageUrls[index] = newImage;
      setImageUrls(newImageUrls);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "이미지 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [imageUrls]);

  const handleReset = () => {
    setStep(AppStep.TOPIC);
    setTopic('');
    setUploadedFile(null);
    setAudience(null);
    setStrategy(null);
    setImageUrls([]);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading && step !== AppStep.STRATEGY && step !== AppStep.IMAGE) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
          <Loader2 className="w-16 h-16 text-yt-red animate-spin mb-4" />
          <p className="text-xl font-medium text-gray-300">
            {step === AppStep.AUDIENCE ? "주제 및 대본 분석 중..." : "이미지 생성 중..."}
          </p>
        </div>
      );
    }

    if (error) {
      const isApiKeyError = error.includes("API 키");
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="bg-red-900/20 border border-red-800 p-8 rounded-2xl max-w-lg">
            <h3 className="text-red-500 text-xl font-bold mb-2">오류가 발생했습니다</h3>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              {isApiKeyError && (
                <button 
                  onClick={async () => {
                    if (window.aistudio) {
                      await window.aistudio.openSelectKey();
                    } else {
                      setIsSettingsOpen(true);
                    }
                    setError(null);
                  }}
                  className="px-6 py-2 bg-naver-green hover:bg-[#02b350] text-white rounded-lg transition-colors font-bold"
                >
                  API 키 설정하기
                </button>
              )}
              <button 
                onClick={() => setError(null)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (step) {
      case AppStep.TOPIC:
        return <TopicInput onSubmit={handleTopicSubmit} />;
      case AppStep.CHARACTER:
        return <CharacterSettings onComplete={handleCharacterSubmit} />;
      case AppStep.AUDIENCE:
        return <AudienceSelector onSelect={handleAudienceSelect} />;
      case AppStep.STRATEGY:
        return strategy ? (
          <StrategyView 
            strategy={strategy} 
            isLoadingImage={isLoading} 
            onGenerateImage={handleGenerateImage} 
          />
        ) : null;
      case AppStep.IMAGE:
        return imageUrls.length > 0 ? (
          <ResultView 
            imageUrls={imageUrls} 
            onReset={handleReset} 
            onRegenerate={() => setStep(AppStep.STRATEGY)}
            onEditImage={handleEditImage}
            isEditing={isLoading}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-naver-light text-naver-text font-sans selection:bg-naver-green selection:text-white flex flex-col">
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />
      <main className="pt-24 pb-12 container mx-auto flex-grow max-w-5xl">
        {renderContent()}
      </main>
      <Footer />
      
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;