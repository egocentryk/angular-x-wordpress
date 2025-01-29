import { Component, inject, OnInit, signal } from '@angular/core'
import { PostsService } from '../services/posts.service'
import { Post } from '../model/post.type'

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  postService = inject(PostsService)
  postItems = signal<Array<Post>>([])

  ngOnInit(): void {
    console.log(this.postService.postItems)
    this.postItems.set(this.postService.postItems)
  }
}
