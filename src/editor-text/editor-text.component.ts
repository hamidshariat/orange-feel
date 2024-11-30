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
  private size = 5;

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
    canvas.addEventListener('mouseup', () => this.stopDrawing());
    canvas.addEventListener('mouseout', () => this.stopDrawing());

    canvas.addEventListener('touchstart', (e: TouchEvent) => this.startDrawing(e));
    canvas.addEventListener('touchmove', (e: TouchEvent) => this.draw(e));
    canvas.addEventListener('touchend', () => this.stopDrawing());
    canvas.addEventListener('touchcancel', () => this.stopDrawing());
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

  private stopDrawing() {
    this.isDrawing = false;
    this.ctx.closePath();
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
