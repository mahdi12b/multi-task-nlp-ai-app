import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
chatForm: FormGroup;
  messages: Message[] = [];
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    }
  }

  sendMessage() {
    if (this.chatForm.valid && !this.isLoading) {
      const messageContent = this.chatForm.value.message.trim();
      this.addMessage(messageContent, true);
      this.chatForm.reset();
      this.simulateAIResponse(messageContent);
    }
  }

  sendQuickMessage(message: string) {
    this.addMessage(message, true);
    this.simulateAIResponse(message);
  }

  private addMessage(content: string, isUser: boolean) {
    const message: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date()
    };
    this.messages.push(message);
    this.saveMessages();
  }

  private simulateAIResponse(userMessage: string) {
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      let response = '';
      
      if (userMessage.toLowerCase().includes('machine learning')) {
        response = 'Le machine learning est une branche de l\'intelligence artificielle qui permet aux ordinateurs d\'apprendre et de s\'améliorer automatiquement à partir de données, sans être explicitement programmés pour chaque tâche.';
      } else if (userMessage.toLowerCase().includes('email')) {
        response = 'Pour rédiger un email professionnel efficace : 1) Utilisez un objet clair, 2) Commencez par une salutation appropriée, 3) Soyez concis et direct, 4) Utilisez un ton professionnel, 5) Terminez par une formule de politesse.';
      } else if (userMessage.toLowerCase().includes('productivité')) {
        response = 'Voici quelques conseils de productivité : 1) Planifiez votre journée, 2) Éliminez les distractions, 3) Utilisez la technique Pomodoro, 4) Priorisez vos tâches importantes, 5) Prenez des pauses régulières.';
      } else {
        response = 'Je comprends votre question. En tant qu\'IA, je peux vous aider avec diverses tâches comme l\'explication de concepts, la rédaction, l\'analyse de données, et bien plus encore. Pouvez-vous être plus spécifique sur ce que vous aimeriez savoir ?';
      }
      
      this.addMessage(response, false);
      this.isLoading = false;
    }, 1500);
  }

  private saveMessages() {
    localStorage.setItem('chatMessages', JSON.stringify(this.messages));
  }
}