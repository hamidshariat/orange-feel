import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-editor-text',
  templateUrl: './editor-text.component.html',
  standalone: true,
  styleUrls: ['./editor-text.component.css']
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

    canvas.addEventListener('mousedown', (e: MouseEvent) => this.startDrawing(e));
    canvas.addEventListener('mousemove', (e: MouseEvent) => this.draw(e));
    canvas.addEventListener('mouseup', (e: MouseEvent) => this.stopDrawing(e));
    canvas.addEventListener('mouseout', (e: MouseEvent) => {
      if (this.isDrawing) this.stopDrawing(e);
    });

    canvas.addEventListener('touchstart', (e: TouchEvent) => this.startDrawing(e));
    canvas.addEventListener('touchmove', (e: TouchEvent) => this.draw(e));
    canvas.addEventListener('touchend', (e: TouchEvent) => this.stopDrawing(e));
    canvas.addEventListener('touchcancel', (e: TouchEvent) => {
      if (this.isDrawing) this.stopDrawing(e);
    });
  }

  private startDrawing(event: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    const { offsetX, offsetY } = this.getEventPosition(event);
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX, offsetY);
  }

  private draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    const { offsetX, offsetY } = this.getEventPosition(event);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
  }

  private stopDrawing(event?: MouseEvent | TouchEvent) {
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
      const canvas = this.canvasRef.nativeElement;
      this.ctx.putImageData(this.restore_array[this.index], 0, 0);
    } else if (this.index === 0) {
      this.clearCanvas();
      this.index = -1;
    }
  }

  private clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  redoLast() {
    if (this.index < this.restore_array.length - 1) {
      this.index++;
      const canvas = this.canvasRef.nativeElement;
      this.ctx.putImageData(this.restore_array[this.index], 0, 0);
    }
  }
  

  private getEventPosition(event: MouseEvent | TouchEvent) {
    const canvas = this.canvasRef.nativeElement;
    if ('touches' in event) {
      const touch = event.touches[0];
      return { offsetX: touch.clientX - canvas.offsetLeft, offsetY: touch.clientY - canvas.offsetTop };
    }
    return { offsetX: event.offsetX, offsetY: event.offsetY };
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
}
