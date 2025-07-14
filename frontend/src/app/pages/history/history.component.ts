import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface ChatHistory {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ImageHistory {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
}

interface VoiceHistory {
  id: string;
  userSpeech: string;
  aiResponse: string;
  timestamp: Date;
}

interface AnalysisHistory {
  id: string;
  text: string;
  analysisType: string;
  results: any;
  timestamp: Date;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  activeFilter = 'all';
  searchQuery = '';
  dateFilter = 'all';
  sortOrder = 'newest';

  chatHistory: ChatHistory[] = [];
  imageHistory: ImageHistory[] = [];
  voiceHistory: VoiceHistory[] = [];
  analysisHistory: AnalysisHistory[] = [];

  filteredChatHistory: ChatHistory[] = [];
  filteredImageHistory: ImageHistory[] = [];
  filteredVoiceHistory: VoiceHistory[] = [];
  filteredAnalysisHistory: AnalysisHistory[] = [];

  filterTabs = [
    {
      key: 'all',
      label: 'Tout',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>'
    },
    {
      key: 'chat',
      label: 'Chat',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>'
    },
    {
      key: 'images',
      label: 'Images',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
    },
    {
      key: 'voice',
      label: 'Vocal',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>'
    },
    {
      key: 'analysis',
      label: 'Analyses',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>'
    }
  ];

  ngOnInit() {
    this.loadAllHistory();
    this.filterHistory();
  }

  loadAllHistory() {
    // Load chat history
    const chatData = localStorage.getItem('chatMessages');
    if (chatData) {
      this.chatHistory = JSON.parse(chatData);
    }

    // Load image history
    const imageData = localStorage.getItem('generatedImages');
    if (imageData) {
      this.imageHistory = JSON.parse(imageData);
    }

    // Load voice history
    const voiceData = localStorage.getItem('voiceConversations');
    if (voiceData) {
      this.voiceHistory = JSON.parse(voiceData);
    }

    // Load analysis history
    const analysisData = localStorage.getItem('textAnalysisHistory');
    if (analysisData) {
      this.analysisHistory = JSON.parse(analysisData);
    }
  }

  filterHistory() {
    this.filteredChatHistory = this.filterItems(this.chatHistory, 'content');
    this.filteredImageHistory = this.filterItems(this.imageHistory, 'prompt');
    this.filteredVoiceHistory = this.filterItems(this.voiceHistory, 'userSpeech');
    this.filteredAnalysisHistory = this.filterItems(this.analysisHistory, 'text');
  }

  private filterItems(items: any[], searchField: string): any[] {
    let filtered = [...items];

    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter(item => 
        item[searchField].toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Date filter
    if (this.dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.timestamp);
        
        switch (this.dateFilter) {
          case 'today':
            return itemDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return itemDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            return itemDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return this.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }

  getTabClass(tabKey: string): string {
    return this.activeFilter === tabKey 
      ? 'border-blue-500 text-blue-600' 
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  }

  getTabBadgeClass(tabKey: string): string {
    return this.activeFilter === tabKey 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-600';
  }

  getItemCount(tabKey: string): number {
    switch (tabKey) {
      case 'all':
        return this.chatHistory.length + this.imageHistory.length + 
               this.voiceHistory.length + this.analysisHistory.length;
      case 'chat':
        return this.filteredChatHistory.length;
      case 'images':
        return this.filteredImageHistory.length;
      case 'voice':
        return this.filteredVoiceHistory.length;
      case 'analysis':
        return this.filteredAnalysisHistory.length;
      default:
        return 0;
    }
  }

  isHistoryEmpty(): boolean {
    if (this.activeFilter === 'all') {
      return this.filteredChatHistory.length === 0 && 
             this.filteredImageHistory.length === 0 && 
             this.filteredVoiceHistory.length === 0 && 
             this.filteredAnalysisHistory.length === 0;
    }
    return this.getItemCount(this.activeFilter) === 0;
  }

  // Action methods
  viewChatDetail(chat: ChatHistory) {
    console.log('View chat detail:', chat);
    // Implement chat detail view
  }

  viewAnalysisDetail(analysis: AnalysisHistory) {
    console.log('View analysis detail:', analysis);
    // Implement analysis detail view
  }

  downloadImage(image: ImageHistory) {
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `generated-image-${image.id}.jpg`;
    link.click();
  }

  playVoiceResponse(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      speechSynthesis.speak(utterance);
    }
  }

  deleteChatItem(id: string) {
    this.chatHistory = this.chatHistory.filter(item => item.id !== id);
    localStorage.setItem('chatMessages', JSON.stringify(this.chatHistory));
    this.filterHistory();
  }

  deleteImageItem(id: string) {
    this.imageHistory = this.imageHistory.filter(item => item.id !== id);
    localStorage.setItem('generatedImages', JSON.stringify(this.imageHistory));
    this.filterHistory();
  }

  deleteVoiceItem(id: string) {
    this.voiceHistory = this.voiceHistory.filter(item => item.id !== id);
    localStorage.setItem('voiceConversations', JSON.stringify(this.voiceHistory));
    this.filterHistory();
  }

  deleteAnalysisItem(id: string) {
    this.analysisHistory = this.analysisHistory.filter(item => item.id !== id);
    localStorage.setItem('textAnalysisHistory', JSON.stringify(this.analysisHistory));
    this.filterHistory();
  }

  clearAllHistory() {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('generatedImages');
      localStorage.removeItem('voiceConversations');
      localStorage.removeItem('textAnalysisHistory');
      
      this.chatHistory = [];
      this.imageHistory = [];
      this.voiceHistory = [];
      this.analysisHistory = [];
      
      this.filterHistory();
    }
  }

  exportHistory() {
    const allHistory = {
      chat: this.chatHistory,
      images: this.imageHistory,
      voice: this.voiceHistory,
      analysis: this.analysisHistory,
      exportDate: new Date()
    };

    const dataStr = JSON.stringify(allHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `multi-ia-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/300x300?text=Image+Error';
  }
}