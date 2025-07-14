import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface AppSettings {
  language: string;
  theme: string;
  notifications: boolean;
  autoSave: boolean;
  sidebarCollapsed: boolean;

  defaultChatModel: string;
  creativity: string;
  responseLength: number;
  autoSuggestions: boolean;
  developerMode: boolean;

  dataCollection: boolean;
  localEncryption: boolean;
  dataRetentionDays: number;

  maxTokens: number;
  requestTimeout: number;
  customApiUrl: string;
  debugMode: boolean;
  experimentalFeatures: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  showSuccessMessage = false;
  originalSettings: AppSettings | null = null;

  private defaultSettings: AppSettings = {
    language: 'fr',
    theme: 'light',
    notifications: true,
    autoSave: true,
    sidebarCollapsed: false,

    defaultChatModel: 'gpt-4',
    creativity: 'balanced',
    responseLength: 2,
    autoSuggestions: true,
    developerMode: false,

    dataCollection: true,
    localEncryption: false,
    dataRetentionDays: 30,

    maxTokens: 2000,
    requestTimeout: 30,
    customApiUrl: '',
    debugMode: false,
    experimentalFeatures: false
  };

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.createForm();
  }

  ngOnInit() {
    this.loadSettings();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      language: [this.defaultSettings.language, Validators.required],
      theme: [this.defaultSettings.theme, Validators.required],
      notifications: [this.defaultSettings.notifications],
      autoSave: [this.defaultSettings.autoSave],
      sidebarCollapsed: [this.defaultSettings.sidebarCollapsed],

      defaultChatModel: [this.defaultSettings.defaultChatModel, Validators.required],
      creativity: [this.defaultSettings.creativity, Validators.required],
      responseLength: [this.defaultSettings.responseLength, [Validators.required, Validators.min(1), Validators.max(3)]],
      autoSuggestions: [this.defaultSettings.autoSuggestions],
      developerMode: [this.defaultSettings.developerMode],

      dataCollection: [this.defaultSettings.dataCollection],
      localEncryption: [this.defaultSettings.localEncryption],
      dataRetentionDays: [this.defaultSettings.dataRetentionDays, [Validators.required, Validators.min(1), Validators.max(365)]],

      maxTokens: [this.defaultSettings.maxTokens, [Validators.required, Validators.min(100), Validators.max(4000)]],
      requestTimeout: [this.defaultSettings.requestTimeout, [Validators.required, Validators.min(5), Validators.max(120)]],
      customApiUrl: [this.defaultSettings.customApiUrl],
      debugMode: [this.defaultSettings.debugMode],
      experimentalFeatures: [this.defaultSettings.experimentalFeatures]
    });
  }

  loadSettings() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const settings = { ...this.defaultSettings, ...JSON.parse(savedSettings) };
        this.originalSettings = { ...settings };
        this.settingsForm.patchValue(settings);
      } else {
        this.originalSettings = { ...this.defaultSettings };
      }
    } else {
      this.originalSettings = { ...this.defaultSettings };
    }
  }

  saveSettings() {
    if (this.settingsForm.valid) {
      const settings: AppSettings = this.settingsForm.value;

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('appSettings', JSON.stringify(settings));
      }

      this.originalSettings = { ...settings };
      this.showSuccessMessage = true;

      setTimeout(() => this.showSuccessMessage = false, 3000);

      this.applyTheme(settings.theme);
      this.applyImmediateSettings(settings);
    }
  }

  resetToDefaults() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      this.settingsForm.patchValue(this.defaultSettings);
      this.originalSettings = { ...this.defaultSettings };
    }
  }

  cancelChanges() {
    if (this.originalSettings) {
      this.settingsForm.patchValue(this.originalSettings);
    }
  }

  exportSettings() {
    const settings = this.settingsForm.value;
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `multi-ia-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const importedSettings = JSON.parse(e.target.result);
            const validatedSettings = this.validateImportedSettings(importedSettings);
            this.settingsForm.patchValue(validatedSettings);
          } catch (error) {
            alert('Erreur lors de l\'importation du fichier. Veuillez vérifier le format.');
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  }

  private validateImportedSettings(imported: any): Partial<AppSettings> {
    const validated: Partial<AppSettings> = {};
    Object.keys(this.defaultSettings).forEach(key => {
      if (imported.hasOwnProperty(key)) {
        validated[key as keyof AppSettings] = imported[key];
      }
    });
    return validated;
  }

  private applyTheme(theme: string) {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');

    if (theme === 'dark') {
      body.classList.add('dark-theme');
    } else if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    } else {
      body.classList.add('light-theme');
    }
  }

  private applyImmediateSettings(settings: AppSettings) {
    if (settings.debugMode) {
      console.log('Debug mode enabled');
      (window as any).debugMode = true;
    } else {
      (window as any).debugMode = false;
    }

    if (settings.experimentalFeatures) {
      console.log('Experimental features enabled');
    }
  }

  getResponseLengthLabel(): string {
    const value = this.settingsForm.get('responseLength')?.value;
    switch (value) {
      case 1: return 'Courte';
      case 2: return 'Moyenne';
      case 3: return 'Détaillée';
      default: return 'Moyenne';
    }
  }

  hasUnsavedChanges(): boolean {
    if (!this.originalSettings) return false;
    const currentValues = this.settingsForm.value;
    return JSON.stringify(currentValues) !== JSON.stringify(this.originalSettings);
  }

  getSettingStatus(settingKey: string): string {
    const value = this.settingsForm.get(settingKey)?.value;
    return value ? 'Activé' : 'Désactivé';
  }

  getModelDisplayName(model: string): string {
    const models: { [key: string]: string } = {
      'gpt-4': 'GPT-4 (Recommandé)',
      'gpt-3.5': 'GPT-3.5 Turbo',
      'claude': 'Claude',
      'gemini': 'Gemini'
    };
    return models[model] || model;
  }

  getCreativityDisplayName(creativity: string): string {
    const levels: { [key: string]: string } = {
      'conservative': 'Conservateur',
      'balanced': 'Équilibré',
      'creative': 'Créatif'
    };
    return levels[creativity] || creativity;
  }
}
