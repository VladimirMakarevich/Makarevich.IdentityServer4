import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { each, isArray, isObject, size } from 'lodash';

export abstract class HttpApiService {

  protected constructor(
    protected http: HttpClient,
  ) {
  }

  protected get<T, K>(url: string, request: T, options?: any): Observable<K> {
    const params = this.createParams(request);
    return this.http.get<K>(this.getFullApiUrl(url), {
      ...options,
      params,
    }) as any;
  }

  protected post<T, K>(url: string, request: T): Observable<K> {
    return this.http.post(this.getFullApiUrl(url), request) as any;
  }

  protected put<T, K>(url: string, request: T): Observable<K> {
    const result = this.http.put<K>(this.getFullApiUrl(url), request) as any;

    return result;
  }

  protected delete(url: string) {
    this.http.delete(this.getFullApiUrl(url));
  }

  private getFullApiUrl(url: string): string {
    return 'https://localhost:5001/' + url;
  }

  private createParams(queryParams: any): HttpParams {
    let params = new HttpParams();
    each(this.toPathObject(queryParams), (value: string, key) => {
      if (!value || (isArray(value) && size(value))) {
        each(value, (item) => {
          params = params.append(key, item);
        });
        return;
      }
      params = params.append(key, value);
    });

    return params;
  }

  private toPathObject(queryParams: any): any {
    const result = {};
    each(queryParams, (param, key) => {
      if (!isArray(param) && isObject(param)) {
        each(param, (paramValue, paramKey) => {
          result[`${key}.${paramKey}`] = paramValue;
        });
      } else {
        result[key] = param;
      }
    });

    return result;
  }

}
