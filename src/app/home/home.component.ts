import { Component, inject } from '@angular/core'
import { PostsService } from '../services/posts.service'
import { RouterLink } from '@angular/router'
import { TruncatePipe } from '../pipes/truncate.pipe'

@Component({
  selector: 'app-home',
  imports: [RouterLink, TruncatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private postService = inject(PostsService)

  isLoading = this.postService.isLoading
  posts = this.postService.newPosts
}
