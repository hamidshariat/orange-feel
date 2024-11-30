import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EditorTextComponent} from '../editor-text/editor-text.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EditorTextComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'orange-feel';
}
