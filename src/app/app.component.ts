import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EditorTextComponent} from '../editor-text/editor-text.component';
import {EditorComponent} from '../editor/editor.component';
import {ThemeService} from '../services/themes.service';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EditorTextComponent, EditorComponent, MatSlideToggle],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'orange-feel';
  isDarkTheme: boolean;

  constructor(private themeService: ThemeService) {
    this.isDarkTheme = this.themeService.getCurrentTheme() === 'dark-theme';
  }

  // سوئیچ کردن بین تم‌ها
  toggleTheme() {
    if (this.isDarkTheme) {
      this.themeService.switchTheme('light-theme');
    } else {
      this.themeService.switchTheme('dark-theme');
    }
    this.isDarkTheme = !this.isDarkTheme; // تغییر وضعیت
  }
}
