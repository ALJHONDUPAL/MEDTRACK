import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private hasShownLoginMessage = false;

  setLoginMessageShown() {
    this.hasShownLoginMessage = true;
  }

  shouldShowLoginMessage(): boolean {
    return !this.hasShownLoginMessage;
  }

  resetLoginMessage() {
    this.hasShownLoginMessage = false;
  }
} 