import { Component, signal } from '@angular/core';
import { EditorTextComponent } from '../editor-text/editor-text.component';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

type View = 'draw' | 'editor';

@Component({
  selector: 'app-root',
  imports: [
    EditorTextComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuTrigger,
    MatMenuItem,
    MatMenu,
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'orange-feel';

  view = signal<View>('draw');

  changeView() {
    this.view() === 'draw' ? this.view.set('editor') : this.view.set('draw');
  }
}
