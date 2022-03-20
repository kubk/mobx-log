import { makeAutoObservable } from 'mobx';

type Theme = 'dark' | 'light';

// A tiny helper to avoid TypeScript type cast
const value = <T extends any>(argument: T) => argument;

export const createThemeStore = () => {
  return makeAutoObservable({
    test: [1, 2, 3],
    theme: value<Theme | null>(null),
    switch(theme: Theme) {
      this.theme = theme;
    },
  });
};
