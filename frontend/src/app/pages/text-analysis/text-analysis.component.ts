import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface AnalysisResults {
  sentiment?: {
    positive: number;
    neutral: number;
    negative: number;
    overall: string;
  };
  summary?: string;
  keywords?: string[];
  entities?: {
    [key: string]: string[];
  };
}
@Component({
  selector: 'app-text-analysis',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './text-analysis.component.html',
  styleUrl: './text-analysis.component.css'
})
export class TextAnalysisComponent {
 analysisForm: FormGroup;
  analysisResults: AnalysisResults | null = null;
  isAnalyzing = false;

  constructor(private fb: FormBuilder,private http:HttpClient) {
    this.analysisForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(10)]],
      analysisType: ['all'],
      language: ['fr']
    });
  }

analyzeText() {
  if (this.analysisForm.valid && !this.isAnalyzing) {
    this.isAnalyzing = true;
    const formData = this.analysisForm.value;

    this.http.post<any>('http://127.0.0.1:8000/textClassification', {
      text: formData.text
    }).subscribe({
      next: res => {
        if (res?.classification?.length > 0) {
          const label = res.classification[0].label.toUpperCase();
          const score = res.classification[0].score;

          // Convertir le label backend vers les formats français + score %
          const sentiment = label === 'POSITIVE' ? 'Positif' :
                            label === 'NEGATIVE' ? 'Négatif' : 'Neutre';

          this.analysisResults = {
            sentiment: {
              positive: label === 'POSITIVE' ? Math.round(score * 100) : 0,
              negative: label === 'NEGATIVE' ? Math.round(score * 100) : 0,
              neutral: label === 'NEUTRAL' ? Math.round(score * 100) : 100 - Math.round(score * 100),
              overall: sentiment
            }
          };
        }
        this.isAnalyzing = false;
      },
      error: err => {
        console.error('Erreur lors de la requête :', err);
        this.isAnalyzing = false;
      }
    });
  }
}




  getSentimentClass(sentiment: string): string {
    switch (sentiment) {
      case 'Positif': return 'text-green-600 font-semibold';
      case 'Négatif': return 'text-red-600 font-semibold';
      default: return 'text-gray-600 font-semibold';
    }
  }

  getEntityTypes(): string[] {
    return this.analysisResults?.entities ? Object.keys(this.analysisResults.entities) : [];
  }
}
