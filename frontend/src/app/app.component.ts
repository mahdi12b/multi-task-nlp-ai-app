import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-ai-app';
  sidebarCollapsed = false;
  mobileSidebarOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeApp();
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  toggleMobileSidebar() {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.mobileSidebarOpen = false;
  }

  private initializeApp() {
    if (isPlatformBrowser(this.platformId)) {
      const isFirstVisit = !localStorage.getItem('hasVisited');
      
      if (isFirstVisit) {
        localStorage.setItem('hasVisited', 'true');
        console.log('Bienvenue dans Multi-IA App !');
      }

      this.initializeDefaultData();
    }
  }

  private initializeDefaultData() {
    if (!localStorage.getItem('chatMessages')) {
      const welcomeMessages = [
        {
          id: '1',
          content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
          isUser: false,
          timestamp: new Date()
        }
      ];
      localStorage.setItem('chatMessages', JSON.stringify(welcomeMessages));
    }

    if (!localStorage.getItem('appSettings')) {
      const defaultSettings = {
        theme: 'light',
        language: 'fr',
        notifications: true,
        autoSave: true,
        sidebarCollapsed: false
      };
      localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    }
  }
}