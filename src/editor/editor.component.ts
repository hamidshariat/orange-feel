import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QuillEditorComponent} from 'ngx-quill';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {AngularEditorConfig, AngularEditorModule} from '@kolkov/angular-editor';
import {CommonModule} from '@angular/common';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {MatCard, MatCardContent} from '@angular/material/card';

@Component({
  selector: 'app-editor',
  imports: [
    CommonModule,
    QuillEditorComponent,
    ReactiveFormsModule,
    MatIcon,
    MatToolbar,
    AngularEditorModule,
    ImageCropperComponent,
    MatCardContent,
    MatCard,
  ],
  templateUrl: './editor.component.html',
  standalone: true,
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  private formBuilder = inject(FormBuilder)
  form: FormGroup = this.formBuilder.group({
    html: new FormControl(''),
    matQuillHtml: new FormControl('')
  })
}
