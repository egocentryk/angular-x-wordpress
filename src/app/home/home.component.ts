import { Component, inject, OnInit, signal } from '@angular/core'
import { PostsService } from '../services/posts.service'
import { Post } from '../model/post.type'
import { catchError } from 'rxjs'

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  postService = inject(PostsService)
  postItems = signal<Array<Post>>([])

  ngOnInit(): void {
    this.postService
      .getPostsFromApi()
      .pipe(
        catchError((err) => {
          console.log(err)
          throw err
        })
      )
      .subscribe((posts) => {
        this.postItems.set(posts)
      })
  }
}
