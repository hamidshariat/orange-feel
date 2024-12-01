import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-editor-text',
  templateUrl: './editor-text.component.html',
  standalone: true,
  styleUrls: ['./editor-text.component.css'],
})
export class EditorTextComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private tool = 'pen';
  private color = '#000000';
  public size = 5;
  private restore_array: ImageData[] = [];
  private index = -1;

  ngAfterViewInit() {
    this.initCanvas();
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    const { offsetX, offsetY } = this.getEventPosition(event);
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX, offsetY);
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    const { offsetX, offsetY } = this.getEventPosition(event);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
  }

  stopDrawing(event?: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.ctx.closePath();

    const canvas = this.canvasRef.nativeElement;
    const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (this.index < this.restore_array.length - 1) {
      this.restore_array = this.restore_array.slice(0, this.index + 1);
    }

    this.restore_array.push(imageData);
    this.index = this.restore_array.length - 1;
  }

  undoLast() {
    if (this.index > 0) {
      this.index--;
      this.ctx.putImageData(this.restore_array[this.index], 0, 0);
    } else if (this.index === 0) {
      this.clearCanvas();
      this.index = -1;
    }
  }

  changeColor(event: any) {
    if (!this.ctx) return;
    this.color = event.target.value;
    this.ctx.strokeStyle = this.color;
  }

  changeSize(event: any) {
    if (!this.ctx) return;
    this.size = event.target.value;
    this.ctx.lineWidth = this.size;
  }

  setTool(tool: string) {
    if (!this.ctx) return;
    this.tool = tool;
    if (this.tool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
    }
  }

  redoLast() {
    if (this.index < this.restore_array.length - 1) {
      this.index++;
      const canvas = this.canvasRef.nativeElement;
      this.ctx.putImageData(this.restore_array[this.index], 0, 0);
    }
  }

  private clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  private getEventPosition(event: MouseEvent | TouchEvent) {
    const canvas = this.canvasRef.nativeElement;
    if ('touches' in event) {
      const touch = event.touches[0];
      return {
        offsetX: touch.clientX - canvas.offsetLeft,
        offsetY: touch.clientY - canvas.offsetTop,
      };
    }
    return { offsetX: event.offsetX, offsetY: event.offsetY };
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    if (!this.ctx) return;
    canvas.width = window.innerWidth - 20;
    canvas.height = 400;

    this.ctx.lineWidth = this.size;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.color;
  }
}
