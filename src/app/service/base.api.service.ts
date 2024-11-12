import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {

  private apiUrlBase: string;

  constructor() {
    this.apiUrlBase = "http://localhost:8080/api/v1";
  }

  protected abstract getResourcePathForApiUrl(): string;

  protected getApiUrl(): string {
    return this.getApiUrlWithAddition("");
  }

  protected getApiUrlWithAddition(apiUrlAddition: string): string {
    return this.apiUrlBase + this.getResourcePathForApiUrl() + apiUrlAddition;
  }
}
