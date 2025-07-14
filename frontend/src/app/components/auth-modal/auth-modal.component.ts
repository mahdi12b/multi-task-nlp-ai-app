import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent implements OnInit {
  @Input() mode: 'signin' | 'signup' = 'signin';
  @Output() close = new EventEmitter<void>();
  @Output() switchMode = new EventEmitter<'signin' | 'signup'>();
  @Output() authSuccess = new EventEmitter<User>();

  authForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.authForm = this.createForm();
  }

  ngOnInit() {
    this.authForm = this.createForm();
  }

  private createForm(): FormGroup {
    const form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // if (this.mode === 'signup') {
    //   form.addControl('name', this.fb.control('', [Validators.required]));
    // }

    return form;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  switchModeHandler() {
    const newMode = this.mode === 'signin' ? 'signup' : 'signin';
    this.switchMode.emit(newMode);
    this.authForm = this.createForm();
    this.errorMessage = '';
  }

  async onSubmit() {
    if (this.authForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const formData = this.authForm.value;
        
        // Simulate successful authentication
        const user: User = {
          id: '1',
          name: this.mode === 'signup' ? formData.name : 'Jean Dupont',
          email: formData.email
        };

        this.authSuccess.emit(user);
        
      } catch (error) {
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      } finally {
        this.isLoading = false;
      }
    }
  }

  // Social Authentication Methods
  async signInWithGoogle() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: '1',
        name: 'Jean Dupont',
        email: 'jean.dupont@gmail.com',
        avatar: 'https://via.placeholder.com/40'
      };
      
      this.authSuccess.emit(user);
      
    } catch (error) {
      this.errorMessage = 'Erreur de connexion avec Google';
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithGitHub() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: '2',
        name: 'Jean Dupont',
        email: 'jean.dupont@github.com',
        avatar: 'https://via.placeholder.com/40'
      };
      
      this.authSuccess.emit(user);
      
    } catch (error) {
      this.errorMessage = 'Erreur de connexion avec GitHub';
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithMicrosoft() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: '3',
        name: 'Jean Dupont',
        email: 'jean.dupont@outlook.com',
        avatar: 'https://via.placeholder.com/40'
      };
      
      this.authSuccess.emit(user);
      
    } catch (error) {
      this.errorMessage = 'Erreur de connexion avec Microsoft';
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithApple() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: '4',
        name: 'Jean Dupont',
        email: 'jean.dupont@icloud.com',
        avatar: 'https://via.placeholder.com/40'
      };
      
      this.authSuccess.emit(user);
      
    } catch (error) {
      this.errorMessage = 'Erreur de connexion avec Apple';
    } finally {
      this.isLoading = false;
    }
  }
}