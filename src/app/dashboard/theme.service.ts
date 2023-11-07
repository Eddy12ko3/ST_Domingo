import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  toggleDarkMode() {
    const currentMode = this.isDarkModeSubject.getValue();
    this.isDarkModeSubject.next(!currentMode);

    
  }
}
