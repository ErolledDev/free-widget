export interface SocialPlatform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  url?: string;
}

export interface QuickQuestion {
  question: string;
  answer: string;
}

export interface WidgetConfig {
  businessName: string;
  colorScheme: string;
  image: string;
  welcomeMessage: string;
  socialLinks: SocialPlatform[];
  quickQuestions: QuickQuestion[];
}