import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  selectedImage: string | null = null;
  showSuccessMessage: boolean = false;

  constructor(private authStateService: AuthStateService) {}

  ngOnInit() {
    // Only show message if it hasn't been shown before
    this.showSuccessMessage = this.authStateService.shouldShowLoginMessage();
    if (this.showSuccessMessage) {
      this.authStateService.setLoginMessageShown();
      // Hide success message after 3 seconds
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    }
  }

  openModal(image: string) {
    this.selectedImage = image;
  }

  closeModal() {
    this.selectedImage = null;
  }
}