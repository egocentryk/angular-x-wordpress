import { inject, Injectable } from '@angular/core'
import { Post } from '../model/post.type'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  http = inject(HttpClient)

  getPostsFromApi() {
    const url = `https://kolektyw.xyz/wp-json/wp/v2/posts`
    return this.http.get<Array<Post>>(url)
  }
}
