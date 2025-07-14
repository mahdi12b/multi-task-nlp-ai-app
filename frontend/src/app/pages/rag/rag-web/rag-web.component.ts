import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface WebUrl {
  id: string;
  url: string;
  title?: string;
  status: 'loading' | 'success' | 'error';
  wordCount?: number;
  scrapedAt?: Date;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: { title: string; url: string }[];
}
@Component({
  selector: 'app-rag-web',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './rag-web.component.html',
  styleUrl: './rag-web.component.css'
})
export class RagWebComponent {
  constructor(private http: HttpClient) {}
  webUrls: WebUrl[] = [];
  messages: Message[] = [];
  currentMessage = '';
  isLoading = false;
  newUrl = '';
  showBulkInput = false;
  bulkUrls = '';

  webSuggestions = [
    "Résumez le contenu de ces sites",
    "Trouvez les points communs entre les articles",
    "Quelles sont les principales informations ?",
    "Comparez les différentes sources"
  ];

  addUrl() {
    if (!this.newUrl.trim()) return;

    const url: WebUrl = {
      id: Date.now().toString(),
      url: this.newUrl.trim(),
      status: 'loading'
    };

    this.webUrls.push(url);
    this.newUrl = '';

    // Simulate web scraping
    setTimeout(() => {
      url.status = Math.random() > 0.2 ? 'success' : 'error';
      if (url.status === 'success') {
        url.title = `Article - ${url.url.split('/')[2]}`;
        url.wordCount = Math.floor(Math.random() * 2000) + 500;
        url.scrapedAt = new Date();
      }
    }, 2000 + Math.random() * 3000);
  }

  addBulkUrls() {
    if (!this.bulkUrls.trim()) return;

    const urls = this.bulkUrls.split('\n')
      .map(url => url.trim())
      .filter(url => url && url.startsWith('http'));

    urls.forEach(urlString => {
      const url: WebUrl = {
        id: Date.now().toString() + Math.random(),
        url: urlString,
        status: 'loading'
      };
      this.webUrls.push(url);

      // Simulate scraping with delay
      setTimeout(() => {
        url.status = Math.random() > 0.2 ? 'success' : 'error';
        if (url.status === 'success') {
          url.title = `Article - ${url.url.split('/')[2]}`;
          url.wordCount = Math.floor(Math.random() * 2000) + 500;
          url.scrapedAt = new Date();
        }
      }, 2000 + Math.random() * 3000);
    });

    this.bulkUrls = '';
    this.showBulkInput = false;
  }

  removeUrl(url: WebUrl) {
    this.webUrls = this.webUrls.filter(u => u.id !== url.id);
  }

  getSuccessfulUrls(): WebUrl[] {
    return this.webUrls.filter(url => url.status === 'success');
  }

  getTotalWords(): number {
    return this.getSuccessfulUrls()
      .reduce((total, url) => total + (url.wordCount || 0), 0);
  }

  selectSuggestion(suggestion: string) {
    this.currentMessage = suggestion;
    this.sendMessage();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

sendMessage() {
  if (!this.currentMessage.trim() || this.isLoading) return;

  const successfulUrls = this.getSuccessfulUrls();
  if (successfulUrls.length === 0) return;

  this.messages.push({
    id: Date.now().toString(),
    type: 'user',
    content: this.currentMessage,
    timestamp: new Date()
  });

  const userMessage = this.currentMessage;
  this.currentMessage = '';
  this.isLoading = true;

  const payload = {
    question: userMessage,
    urls: successfulUrls.map(url => ({
      url: url.url,
      title: url.title || url.url
    }))
  };

  // ✅ Typage explicite de la réponse
  this.http.post<{ answer: string; sources: string[] }>(
    'http://localhost:8000/rag/web-analyze/',
    payload
  ).subscribe({
    next: (res) => {
      const uniqueSources = Array.from(new Set(res.sources)); // Retire les doublons éventuels

      this.messages.push({
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: res.answer,
        timestamp: new Date(),
        sources: uniqueSources.map((url) => ({
          title: `Source - ${url.split('/')[2]}`,
          url
        }))
      });

      this.isLoading = false;
    },
    error: (err) => {
      this.messages.push({
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Erreur lors de l’analyse des sites web.',
        timestamp: new Date()
      });
      this.isLoading = false;
    }
  });
}



}
