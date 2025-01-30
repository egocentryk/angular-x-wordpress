import { Component, inject } from '@angular/core'
import { PostsService } from '../services/posts.service'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private postService = inject(PostsService)

  isLoading = this.postService.isLoading
  posts = this.postService.newPosts
}
