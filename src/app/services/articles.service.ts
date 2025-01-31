import { Injectable, inject } from '@angular/core'
import { Article } from '../model/article.type'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment.development'

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  http = inject(HttpClient)

  getArticleFromApi(slug: string | null) {
    const url = `${environment.api.url}/posts?slug=${slug}`
    return this.http.get<Array<Article>>(url)
  }
}
