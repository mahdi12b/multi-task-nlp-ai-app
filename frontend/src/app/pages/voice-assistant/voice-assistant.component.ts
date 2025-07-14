import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Conversation {
  id: string;
  userSpeech: string;
  aiResponse: string;
  timestamp: Date;
}
@Component({
  selector: 'app-voice-assistant',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './voice-assistant.component.html',
  styleUrl: './voice-assistant.component.css'
})
export class VoiceAssistantComponent implements OnInit, OnDestroy {
  isRecording = false;
  isSupported = false;
  recognitionLanguage = 'fr-FR';
  speechVoice = 'female';
  conversations: Conversation[] = [];
  voiceLevelBars: number[] = [];
  
  private recognition: any;
  private synthesis: any;
  private voiceLevelInterval: any;

  ngOnInit() {
    this.checkBrowserSupport();
    this.initializeVoiceLevelBars();
    this.loadConversations();
  }

  ngOnDestroy() {
    if (this.voiceLevelInterval) {
      clearInterval(this.voiceLevelInterval);
    }
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  checkBrowserSupport() {
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (this.isSupported) {
      this.initializeSpeechRecognition();
    }
  }

  initializeSpeechRecognition() {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.synthesis = window.speechSynthesis;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = this.recognitionLanguage;

    this.recognition.onstart = () => {
      this.isRecording = true;
      this.startVoiceLevelAnimation();
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      this.stopVoiceLevelAnimation();
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.processVoiceInput(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isRecording = false;
      this.stopVoiceLevelAnimation();
    };
  }

  toggleRecording() {
    if (!this.isSupported) return;

    if (this.isRecording) {
      this.recognition.stop();
    } else {
      this.recognition.lang = this.recognitionLanguage;
      this.recognition.start();
    }
  }

  processVoiceInput(transcript: string) {
    const response = this.generateAIResponse(transcript);
    
    const conversation: Conversation = {
      id: Date.now().toString(),
      userSpeech: transcript,
      aiResponse: response,
      timestamp: new Date()
    };

    this.conversations.unshift(conversation);
    this.saveConversations();
    
    // Speak the response
    this.speakText(response);
  }

  generateAIResponse(input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('météo') || lowerInput.includes('temps')) {
      return 'Il fait beau aujourd\'hui avec une température de 22 degrés et un ciel dégagé.';
    } else if (lowerInput.includes('heure') || lowerInput.includes('temps')) {
      const now = new Date();
      return `Il est actuellement ${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}.`;
    } else if (lowerInput.includes('blague') || lowerInput.includes('drôle')) {
      const jokes = [
        'Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon, ils tombent dans le bateau !',
        'Que dit un escargot quand il croise une limace ? "Regarde, un nudiste !"',
        'Comment appelle-t-on un chat tombé dans un pot de peinture ? Un chat-mallow !'
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    } else if (lowerInput.includes('aide') || lowerInput.includes('comment')) {
      return 'Je peux vous aider avec la météo, l\'heure, des blagues, ou répondre à vos questions. Dites simplement ce que vous voulez savoir !';
    } else {
      return 'Je comprends votre demande. En tant qu\'assistant vocal, je peux vous aider avec diverses informations. Que souhaitez-vous savoir ?';
    }
  }

  speakText(text: string) {
    if (this.synthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.recognitionLanguage;
      utterance.rate = 0.9;
      utterance.pitch = this.speechVoice === 'female' ? 1.2 : 0.8;
      this.synthesis.speak(utterance);
    }
  }

  executeQuickCommand(command: string) {
    let commandText = '';
    
    switch (command) {
      case 'weather':
        commandText = 'Quel temps fait-il ?';
        break;
      case 'time':
        commandText = 'Quelle heure est-il ?';
        break;
      case 'joke':
        commandText = 'Raconte-moi une blague';
        break;
      case 'help':
        commandText = 'Comment ça marche ?';
        break;
    }
    
    if (commandText) {
      this.processVoiceInput(commandText);
    }
  }

  getMicrophoneButtonClass(): string {
    if (!this.isSupported) {
      return 'microphone-button microphone-disabled';
    } else if (this.isRecording) {
      return 'microphone-button microphone-recording';
    } else {
      return 'microphone-button microphone-idle';
    }
  }

  getStatusText(): string {
    if (!this.isSupported) {
      return 'Non supporté';
    } else if (this.isRecording) {
      return 'Écoute en cours...';
    } else {
      return 'Prêt à écouter';
    }
  }

  getStatusDescription(): string {
    if (!this.isSupported) {
      return 'Votre navigateur ne supporte pas la reconnaissance vocale';
    } else if (this.isRecording) {
      return 'Parlez maintenant, je vous écoute';
    } else {
      return 'Cliquez sur le microphone pour commencer';
    }
  }

  private initializeVoiceLevelBars() {
    this.voiceLevelBars = Array(8).fill(8);
  }

  private startVoiceLevelAnimation() {
    this.voiceLevelInterval = setInterval(() => {
      this.voiceLevelBars = this.voiceLevelBars.map(() => 
        Math.random() * 56 + 8 // Random height between 8 and 64
      );
    }, 100);
  }

  private stopVoiceLevelAnimation() {
    if (this.voiceLevelInterval) {
      clearInterval(this.voiceLevelInterval);
      this.voiceLevelBars = Array(8).fill(8);
    }
  }

  private loadConversations() {
    const saved = localStorage.getItem('voiceConversations');
    if (saved) {
      this.conversations = JSON.parse(saved);
    }
  }

  private saveConversations() {
    localStorage.setItem('voiceConversations', JSON.stringify(this.conversations));
  }
}