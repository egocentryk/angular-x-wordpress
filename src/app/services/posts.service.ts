import { computed, inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment.development'
import { rxResource } from '@angular/core/rxjs-interop'
import { catchError, map, switchMap, tap } from 'rxjs'
import { Article } from '../model/article.type'

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private url = `${environment.api.url}/posts`

  private http = inject(HttpClient)

  private postResource = rxResource({
    loader: () => {
      return this.http.get<Array<Article>>(this.url).pipe(
        catchError((err) => {
          console.log(err)
          throw err
        }),
        map((post) => post)
      )
    },
  })

  newPosts = computed(() => this.postResource.value() ?? ([] as Article[]))
  isLoading = this.postResource.isLoading
}
