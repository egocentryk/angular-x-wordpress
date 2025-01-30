import { inject, Injectable } from '@angular/core'
import { Post } from '../model/post.type'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment.development'

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  http = inject(HttpClient)

  getPostsFromApi() {
    const url = `${environment.apiUrl}posts`
    return this.http.get<Array<Post>>(url)
  }
}
