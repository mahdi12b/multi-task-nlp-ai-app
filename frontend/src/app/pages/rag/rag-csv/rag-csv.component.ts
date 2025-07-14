import { CommonModule} from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface CSVFile {
  id: string;
  name: string;
  size: string;
  file: File;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-rag-csv',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './rag-csv.component.html',
  styleUrl: './rag-csv.component.css'
})
export class RagCsvComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {}


  csvFiles: CSVFile[] = [];
  messages: Message[] = [];
  currentMessage = '';
  isLoading = false;
  isDragOver = false;

  suggestions = [
    "Analysez les tendances dans mes données",
    "Trouvez les valeurs aberrantes",
    "Résumez les statistiques principales",
    "Identifiez les corrélations"
  ];

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) this.handleFiles(files);
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files) this.handleFiles(files);
  }

  private handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        this.csvFiles.push({
          id: Date.now().toString() + i,
          name: file.name,
          size: this.formatFileSize(file.size),
          file: file
        });
      }
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile(file: CSVFile) {
    this.csvFiles = this.csvFiles.filter(f => f.id !== file.id);
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
  if (!this.currentMessage.trim() || this.isLoading || this.csvFiles.length === 0) return;

  const file = this.csvFiles[0].file; // on prend le premier fichier

  // Ajouter le message utilisateur
  this.messages.push({
    id: Date.now().toString(),
    type: 'user',
    content: this.currentMessage,
    timestamp: new Date()
  });

  const userMessage = this.currentMessage;
  this.currentMessage = '';
  this.isLoading = true;

  // Préparer la requête
  const formData = new FormData();
  formData.append('file', file);
  formData.append('question', userMessage);

  this.http.post<any>('http://localhost:8000/rag/analyze-csv/', formData).subscribe({
    next: (res) => {
      console.log(res)
      this.messages.push({
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: res.answer, // réponse du backend
        timestamp: new Date()
      });
      this.isLoading = false;
    },
    error: (err) => {
      this.messages.push({
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Erreur lors de l’analyse du fichier.',
        timestamp: new Date()
      });
      this.isLoading = false;
    }
  });
}

}