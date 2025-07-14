import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

interface SummaryOptions {
  length: 'short' | 'medium' | 'long';
  type: 'extractive' | 'abstractive' | 'bullet';
  language: 'fr' | 'en' | 'es' | 'de';
  focus: 'general' | 'key-points' | 'conclusions' | 'facts';
  preserveStructure: boolean;
  includeKeywords: boolean;
  addReadingTime: boolean;
}

@Component({
  selector: 'app-text-summarizer',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule ],
  templateUrl: './text-summarizer.component.html',
  styleUrl: './text-summarizer.component.css'
})
export class TextSummarizerComponent {
  inputText = '';
  summary = '';
  keywords: string[] = [];
  isLoading = false;
  showAdvancedOptions = false;
  error: string = '';

  constructor(private http: HttpClient) {}

  summaryOptions: SummaryOptions = {
    length: 'medium',
    type: 'abstractive',
    language: 'fr',
    focus: 'general',
    preserveStructure: false,
    includeKeywords: true,
    addReadingTime: true
  };

  getWordCount(): number {
    if (!this.inputText.trim()) return 0;
    return this.inputText.trim().split(/\s+/).length;
  }

  getSummaryWordCount(): number {
    if (!this.summary.trim()) return 0;
    return this.summary.trim().split(/\s+/).length;
  }

  getReductionPercentage(): number {
    const originalWords = this.getWordCount();
    const summaryWords = this.getSummaryWordCount();
    if (originalWords === 0) return 0;
    return Math.round(((originalWords - summaryWords) / originalWords) * 100);
  }

  getReadingTime(): number {
    const wordsPerMinute = 200;
    return Math.ceil(this.getSummaryWordCount() / wordsPerMinute);
  }

  clearText(): void {
    this.inputText = '';
    this.summary = '';
    this.keywords = [];
    this.error = '';
  }

  async pasteFromClipboard(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.inputText = text;
    } catch (err) {
      alert('Impossible de coller depuis le presse-papiers.');
    }
  }


  summarizeText(): void {
    if (!this.inputText.trim()) return;

    this.isLoading = true;
    this.summary = '';
    this.error = '';

    const apiUrl = 'http://127.0.0.1:8000/summarization';
    const payload = {
      text: this.inputText
    };

    this.http.post<any>(apiUrl, payload)
      .pipe(
        catchError(err => {
          this.error = 'Erreur lors de la génération du résumé.';
          console.error('Erreur API:', err);
          this.isLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe(response => {
        console.log('📦 Résultat du backend :', response);
        this.summary = response.summary || 'Résumé vide.';
        this.isLoading = false;
      });
  }

  formatSummary(summary: string): string {
    return summary.replace(/\n/g, '<br>');
  }

  async copySummary(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.summary);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  }

  downloadSummary(): void {
    const content = `Résumé généré:\n\n${this.summary}\n\n` +
      (this.keywords.length ? `Mots-clés: ${this.keywords.join(', ')}\n` : '') +
      `Date: ${new Date().toLocaleString()}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  shareSummary(): void {
    if (navigator.share) {
      navigator.share({ title: 'Résumé IA', text: this.summary }).catch(err => console.error(err));
    } else {
      this.copySummary();
      alert('Résumé copié pour partage.');
    }
  }

  regenerateSummary(): void {
    if (this.inputText.trim()) {
      this.summarizeText();
    }
  }
}
