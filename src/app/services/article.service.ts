import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { environment } from '../../environments/environment.development'
import { Article } from '../model/article.type'
import { Comment } from '../model/comment.type'
import { Tag } from '../model/tag.type'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private http: HttpClient) {}

  getArticles(page: number): Observable<Article[]> {
    const url = `${environment.api.url}${environment.api.paths.posts}?page=${page}&per_page=10`
    return this.http.get<Article[]>(url)
  }

  getTags(ids: string): Observable<Tag[]> {
    const url = environment.api.url + environment.api.paths.tags + ids
    return this.http.get<Tag[]>(url)
  }

  getComments(ids: string): Observable<Comment[]> {
    const url = environment.api.url + environment.api.paths.comments + ids
    return this.http.get<Comment[]>(url)
  }

  getHeaders(): Observable<HttpResponse<Article[]>> {
    const url = `${environment.api.url}${environment.api.paths.posts}?per_page=10`
    return this.http.get<Article[]>(url, {
      observe: 'response',
    })
  }
}
