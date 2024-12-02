// src/app/services/theme.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: string = 'light-theme';

  constructor() {
    this.setInitialTheme();
  }

  private setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.switchTheme(savedTheme);
    } else {
      this.switchTheme(this.currentTheme);
    }
  }

  switchTheme(theme: string) {
    this.currentTheme = theme;
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme); // ذخیره تم در localStorage
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }
}
