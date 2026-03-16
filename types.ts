
export enum TargetAudience {
  TEENS = "10대~20대 초반",
  ADULTS = "20대 후반~40대",
  SENIORS = "50대~60대 이상 (시니어)",
  ALL = "전연령 (MrBeast 스타일)",
}

export interface HookOption {
  label: string;      // e.g., "논리적 접근", "감성적 접근"
  hookMainText: string;
  hookSubText: string;
  textStyleSuggestion: string;
}

export interface StrategyResponse {
  strategySummary: string;
  imagePrompt: string;
  imagePromptKo: string;
  option1: HookOption;
  option2: HookOption;
}

export enum AppStep {
  TOPIC = 'topic',
  CHARACTER = 'character', 
  AUDIENCE = 'audience',
  STRATEGY = 'strategy',
  IMAGE = 'image',
}

export interface UploadedFile {
  name: string;
  content: string; // Text content of the file
  type: string;
}

export type CharacterType = 'person' | 'animal' | 'object';

export interface CharacterConfig {
  include: boolean;
  type?: CharacterType;
  // For Person
  gender?: string;
  ethnicity?: string;
  age?: string;
  // For Animal/Object
  description?: string;
}

export type BorderStyle = 'none' | 'solid' | 'neon' | 'sketch';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
