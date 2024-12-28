import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly _httpClient = inject(HttpClient);

  home(formData: FormData) {
    return this._httpClient.post('https://converterpdf-production-6510.up.railway.app/convert/docx-to-pdf', formData, {
      responseType: 'blob'
    });
  }
}
