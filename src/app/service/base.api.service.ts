import { Injectable } from '@angular/core';
import { StringUtil } from '../entity/misc/string/util/string-util';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {

  private apiUrlBase: string;

  constructor() {
    this.apiUrlBase = "http://localhost:8080/api/v1";
  }

  abstract getResourcePathForApiUrl(): string;

  protected getApiUrl(): string {
    return this.getApiUrlWithAddition("");
  }

  protected getApiUrlWithAddition(apiUrlAddition: string): string {
    let urlResult = this.apiUrlBase + this.getResourcePathForApiUrl();
    if(apiUrlAddition) {
      urlResult += "/" + apiUrlAddition;
    }
    return urlResult;
  }

  protected addQueryParameterToApiUrl(currentApiUrl: string, queryParameterKey: string, queryParameterValue: string): string {
    let resultApiUrl = currentApiUrl;
    if(!StringUtil.isEmpty(resultApiUrl)) {
      if(StringUtil.isEmpty(queryParameterKey)) {
        throw new Error("Was provided a null/empty Query Parameter Key to append to API URL [" + currentApiUrl + "]");
      }
      if(StringUtil.isEmpty(queryParameterValue)) {
        throw new Error("Was provided a null/empty Query Parameter Value to append to API URL [" + currentApiUrl + "] with Query Parameter Key [" + queryParameterKey + "]");
      }

      let indexOfQueryParametersDelimiter = resultApiUrl.indexOf("?");
      if(indexOfQueryParametersDelimiter < 0) {
        resultApiUrl += "?";
      }
      resultApiUrl += queryParameterKey + "=" + queryParameterValue;

    } else {
      console.warn("Was provided a null/empty API URL to append Query Parameters onto, ignoring");
    }
    return resultApiUrl;
  }

}
