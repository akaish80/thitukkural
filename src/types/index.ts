// Core data types for Thirukkural application

export interface KurralData {
  Index: number;
  Kurral_id?: number;
  Tamil: string;
  line1: string;
  line2: string;
  KalaignarUrai: string;
  MuVaUrai: string;
  SolomonPaapaiyaUrai: string;
  English: string;
  EnglishMeaning: string;
  Transliteration: string;
  adikaram_number?: number;
  isClicked?: boolean;
  line1Replace?: boolean;
  line2Replace?: boolean;
  inputWord?: string;
  error?: boolean;
}

export interface AdikaramData {
  Index: number;
  adikaram_number: number;
  Tamil: string;
  English: string;
  Transliteration: string;
  kurralStart: number;
  kurralEnd: number;
  isClicked?: boolean;
}

export interface PaalData {
  Index: number;
  Paal_number?: number;
  paal_number?: number;
  Tamil: string;
  English: string;
  Transliteration: string;
  adikaramStart: number;
  adikaramEnd: number;
  count?: number;
}

export interface TamilLetter {
  letter: string;
  name: string;
  sound: string;
}

export interface PracticeType {
  id: number;
  name: string;
  description: string;
}

// Service types
export interface SearchResult {
  adikaram?: number;
  paal?: number;
  kurral?: number;
  results: KurralData[];
  paalInfo?: PaalData | null;
  adikaramInfo?: AdikaramData | null;
}

export interface ChatbotService {
  paalList: PaalData[];
  aikaram: AdikaramData[];
  kurrals: KurralData[];
  search(query: string, topN?: number): SearchResult;
  getKurralById(id: number): KurralData | null;
  getAdikaramInfo(n: number): AdikaramData | null;
}

// Theme types
export type ThemeType = 'light' | 'dark' | 'blue' | 'green' | 'purple';
export type ColorSchemeType = 'default' | 'highContrast' | 'colorBlind';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export interface ThemeContextType {
  theme: ThemeType;
  colorScheme: ColorSchemeType;
  setTheme: (theme: ThemeType) => void;
  setColorScheme: (scheme: ColorSchemeType) => void;
}

// Redux types
export interface ContentState {
  kurralList: KurralData[];
  adhikaramList: AdikaramData[];
  paalList: PaalData[];
  loading: boolean;
  error: string | null;
}

export interface KurralState {
  selectedKurral: KurralData | null;
  kurralDataList: KurralData[];
  loading: boolean;
  error: string | null;
}

export interface UserState {
  name: string;
  preferences: {
    theme: ThemeType;
    language: string;
  };
}

// Component prop types
export interface DragItem {
  name: string;
  type: string;
  Tamil?: string;
  Index?: number;
}

export interface DropContainerProps {
  name: string;
  type: string;
  accept?: string[];
  onDrop?: (item: DragItem) => void;
}

export interface DragContainerProps {
  name: string;
  type: string;
}

// Utility types
export type ReportHandler = (metric: any) => void;

export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}
