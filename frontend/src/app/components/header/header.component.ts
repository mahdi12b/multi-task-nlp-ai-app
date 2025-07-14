import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,AuthModalComponent,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Input() sidebarCollapsed = false;
  @Output() mobileSidebarToggle = new EventEmitter<void>();

  // Authentication state
  isAuthenticated = false;
  user: User | null = null;

  // Modal states
  showAuthModal = false;
  authMode: 'signin' | 'signup' = 'signin';
  showNotifications = false;
  showUserMenu = false;

  // Search
  searchQuery = '';

  // Notifications
  notifications: Notification[] = [];
  notificationCount = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    // this.loadUserState();
    this.loadNotifications();
    // this.setupClickOutsideListeners();
  }

  // private loadUserState() {
  //   const savedUser = localStorage.getItem('currentUser');
  //   if (savedUser) {
  //     this.user = JSON.parse(savedUser);
  //     this.isAuthenticated = true;
  //   }
  // }

  private loadNotifications() {
    this.notifications = [
      {
        id: '1',
        title: 'Nouvelle fonctionnalité',
        message: 'Découvrez notre nouveau générateur d\'images IA',
        time: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: '2',
        title: 'Analyse terminée',
        message: 'Votre analyse de sentiment est prête',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2)
      }
    ];
    
    this.notificationCount = this.notifications.length;
  }

  // private setupClickOutsideListeners() {
  //   document.addEventListener('click', (event) => {
  //     const target = event.target as HTMLElement;
      
  //     if (!target.closest('.notification-container')) {
  //       this.showNotifications = false;
  //     }
      
  //     if (!target.closest('.user-menu')) {
  //       this.showUserMenu = false;
  //     }
  //   });
  // }

  // Navigation methods
  toggleMobileSidebar() {
    this.mobileSidebarToggle.emit();
  }

  getPageTitle(): string {
    const url = this.router.url;
    const titles: { [key: string]: string } = {
      '/': 'Tableau de bord',
      '/home': 'Tableau de bord',
      '/chat/general': 'Chat Général',
      '/generate/images': 'Génération d\'Images',
      '/analysis/text': 'Analyse de Texte',
      '/voice/assistant': 'Assistant Vocal',
      '/translation/text': 'Traduction de Texte',
      '/productivity/summarizer': 'Résumé Automatique',
      '/creative/writing': 'Écriture Créative',
      '/history': 'Historique',
      '/settings': 'Paramètres'
    };
    
    return titles[url] || 'Multi-IA App';
  }

  // Search methods
  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement search functionality
    }
  }

  // Notification methods
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  clearAllNotifications() {
    this.notifications = [];
    this.notificationCount = 0;
  }

  // User menu methods
  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Authentication methods
  openSignIn() {
    this.authMode = 'signin';
    this.showAuthModal = true;
  }

  openSignUp() {
    this.authMode = 'signup';
    this.showAuthModal = true;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }

  switchAuthMode(mode: 'signin' | 'signup') {
    this.authMode = mode;
  }

  onAuthSuccess(user: User) {
    this.user = user;
    this.isAuthenticated = true;
    this.showAuthModal = false;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Add success notification
    this.notifications.unshift({
      id: Date.now().toString(),
      title: 'Connexion réussie',
      message: `Bienvenue ${user.name} !`,
      time: new Date()
    });
    this.notificationCount = this.notifications.length;
  }

  logout() {
    this.isAuthenticated = false;
    this.user = null;
    this.showUserMenu = false;
    localStorage.removeItem('currentUser');
    
    this.notifications.unshift({
      id: Date.now().toString(),
      title: 'Déconnexion',
      message: 'À bientôt !',
      time: new Date()
    });
    this.notificationCount = this.notifications.length;
    
    this.router.navigate(['/home']);
  }
}