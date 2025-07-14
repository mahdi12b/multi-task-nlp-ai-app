import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isCollapsed = false;
  isMobileOpen = false;
  isRagOpen = false;  // ⬅️ Pour ouvrir/fermer le sous-menu RAG

  @Output() sidebarToggle = new EventEmitter<boolean>();

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggle.emit(this.isCollapsed);
    
  }

  toggleMobileSidebar() {
    this.isMobileOpen = !this.isMobileOpen;
  }
}