import { computed, effect, inject, Injectable } from '@angular/core'
import { Post } from '../model/post.type'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment.development'
import { rxResource } from '@angular/core/rxjs-interop'
import { catchError, map, tap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private url = `${environment.api.url}/posts`

  private http = inject(HttpClient)

  private postResource = rxResource({
    loader: () => {
      console.log('Before http request')
      return this.http.get<Array<Post>>(this.url).pipe(
        catchError((err) => {
          console.log(err)
          throw err
        }),
        tap(() => console.log('Before map')),
        map((post) => post),
        tap(() => console.log('After map'))
      )
    },
  })

  newPosts = computed(() => this.postResource.value() ?? ([] as Post[]))
  isLoading = this.postResource.isLoading

  loadingEffect = effect(() =>
    console.log('Loading indicator: ', this.postResource.isLoading())
  )
  postsEffect = effect(() => console.log('Post data: ', this.newPosts()))
}
