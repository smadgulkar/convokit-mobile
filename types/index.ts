import { IconProps } from '@expo/vector-icons/build/createIconSet';

export interface Category {
  id: string;
  label: string;
  prompt: string;
}

export interface Context {
  id: string;
  icon: string; // Name of the icon from @expo/vector-icons
  label: string;
  color: string;
  description: string;
  categories: Category[];
}

export interface Question {
  main: string;
  followUps: string[];
} 