import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
}

// ✅ Fonction utilitaire pour vérifier si on est dans le navigateur
function isBrowser(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css']
})
export class ImageGeneratorComponent {
  imageForm: FormGroup;
  generatedImages: GeneratedImage[] = [];
  isGenerating = false;

  constructor(private fb: FormBuilder) {
    this.imageForm = this.fb.group({
      prompt: ['', [Validators.required, Validators.minLength(10)]],
      style: ['realistic'],
      size: ['512x512'],
      quality: ['standard']
    });

    // ✅ Ne pas utiliser localStorage si on est côté serveur
    if (isBrowser()) {
      const savedImages = localStorage.getItem('generatedImages');
      if (savedImages) {
        this.generatedImages = JSON.parse(savedImages);
      }
    }
  }

  generateImage() {
    if (this.imageForm.valid && !this.isGenerating) {
      this.isGenerating = true;
      const formData = this.imageForm.value;

      // Simulation d'une génération d'image
      setTimeout(() => {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          prompt: formData.prompt,
          imageUrl: `https://picsum.photos/512/512?random=${Date.now()}`,
          timestamp: new Date()
        };

        this.generatedImages.unshift(newImage);
        this.saveImages();
        this.isGenerating = false;
        this.imageForm.patchValue({ prompt: '' });
      }, 3000);
    }
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/512x512?text=Image+Error';
  }

  downloadImage(image: GeneratedImage) {
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `generated-image-${image.id}.jpg`;
    link.click();
  }

  shareImage(image: GeneratedImage) {
    if (navigator.share) {
      navigator.share({
        title: 'Image générée par IA',
        text: image.prompt,
        url: image.imageUrl
      });
    } else {
      navigator.clipboard.writeText(image.imageUrl);
      alert('Lien copié dans le presse-papiers !');
    }
  }

  // ✅ Sécurisé même en SSR
  private saveImages() {
    if (isBrowser()) {
      localStorage.setItem('generatedImages', JSON.stringify(this.generatedImages));
    }
  }
}
