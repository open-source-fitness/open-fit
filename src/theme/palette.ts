// Sport palette from the training sheet prototype, expressed in native sRGB.
export const chrome = {
  background: '#08152D',
  text: '#F6F9FC',
  secondary: '#B4C1CF',
  border: '#43516B',
  accent: '#C4EA1B',
  onAccent: '#090F2F',
};

export const controlRadius = 4;
export const screenGutter = 16;

export const themes = {
  light: {
    background: '#F4F8FB',
    surface: '#E9EFF3',
    surfaceStrong: '#DCE3E9',
    text: '#090F2F',
    secondary: '#4D5867',
    accent: chrome.accent,
    border: '#AAB5BF',
    onAccent: chrome.onAccent,
    error: '#A02523',
  },
  dark: {
    background: '#131A24',
    surface: '#19222E',
    surfaceStrong: '#253140',
    text: '#EDF3FA',
    secondary: '#ABB7C7',
    accent: chrome.accent,
    border: '#49576B',
    onAccent: chrome.onAccent,
    error: '#FFA39B',
  },
};
