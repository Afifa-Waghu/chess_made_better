import { Theme } from '../types/chess';

export const themes: Theme[] = [
  {
    name: 'Princess Pink',
    primary: '#FF69B4',
    secondary: '#FFB6C1',
    accent: '#FF1493',
    background: '#FFF0F5',
    boardLight: '#FFE4E1',
    boardDark: '#FFC0CB',
    text: '#8B008B',
    border: '#DA70D6'
  },
  {
    name: 'Mint Dream',
    primary: '#98FB98',
    secondary: '#F0FFF0',
    accent: '#00FF7F',
    background: '#F5FFFA',
    boardLight: '#F0FFF0',
    boardDark: '#98FB98',
    text: '#006400',
    border: '#90EE90'
  },
  {
    name: 'Lavender Love',
    primary: '#DDA0DD',
    secondary: '#E6E6FA',
    accent: '#9370DB',
    background: '#F8F8FF',
    boardLight: '#E6E6FA',
    boardDark: '#DDA0DD',
    text: '#4B0082',
    border: '#BA55D3'
  },
  {
    name: 'Sunset Peach',
    primary: '#FFCCCB',
    secondary: '#FFF5EE',
    accent: '#FF7F50',
    background: '#FFF8DC',
    boardLight: '#FFF5EE',
    boardDark: '#FFCCCB',
    text: '#CD5C5C',
    border: '#F08080'
  },
  {
    name: 'Ocean Breeze',
    primary: '#87CEEB',
    secondary: '#E0F6FF',
    accent: '#1E90FF',
    background: '#F0F8FF',
    boardLight: '#E0F6FF',
    boardDark: '#87CEEB',
    text: '#4682B4',
    border: '#5F9EA0'
  }
];

export const getTheme = (themeName: string): Theme => {
  return themes.find(theme => theme.name === themeName) || themes[0];
};