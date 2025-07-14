import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DatabaseTable {
  name: string;
  rows: number;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  SQLquery: string;
  SQLResult?: string; // Added sqlResult field
  timestamp: Date;
}

interface QuickAction {
  label: string;
  icon: string;
  query: string;
}

@Component({
  selector: 'app-rag-database',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './rag-database.component.html',
  styleUrl: './rag-database.component.css'
})
export class RagDatabaseComponent {
  constructor(private http: HttpClient) {}
  messages: Message[] = [];
  currentMessage = '';
  isLoading = false;

  availableTables: DatabaseTable[] = [
    { name: 'users', rows: 1250 },
    { name: 'orders', rows: 3420 },
    { name: 'products', rows: 856 },
    { name: 'categories', rows: 45 },
    { name: 'reviews', rows: 2180 },
    { name: 'inventory', rows: 1890 }
  ];

  quickActions: QuickAction[] = [
    {
      label: 'Résumé des ventes',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      query: 'Donne-moi un résumé des ventes du dernier trimestre'
    },
    {
      label: 'Top produits',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      query: 'Quels sont les produits les plus vendus ?'
    },
    {
      label: 'Analyse clients',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      query: 'Analyse le comportement des clients'
    },
    {
      label: 'Tendances',
      icon: 'M7 12l3-3 3 3 4-4',
      query: 'Montre-moi les tendances sur les 6 derniers mois'
    }
  ];

  selectQuickAction(action: QuickAction) {
    this.currentMessage = action.query;
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

    this.messages.push({
      id: Date.now().toString(),
      type: 'user',
      SQLquery: this.currentMessage,
      SQLResult:"",
      timestamp: new Date()
    });

    const userMessage = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;

    const payload = {
      question: userMessage,
    };

    this.http.post<any>('http://localhost:8000/rag/db-analyze/', payload).subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.sql_result[0][0])
        
        this.messages.push({
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          SQLquery: res.sql_query,
          SQLResult: res.sql_result[0][0], // Added sqlResult from response
          timestamp: new Date()
        });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          SQLquery: 'Erreur lors de l’analyse de la base de données.',
          SQLResult: 'Erreur: impossible de récupérer les résultats.',
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }
}