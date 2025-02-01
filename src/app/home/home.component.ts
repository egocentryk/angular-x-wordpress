// import { Component, inject } from '@angular/core'
// import { PostsService } from '../services/posts.service'
// import { RouterLink } from '@angular/router'
// import { TruncatePipe } from '../pipes/truncate.pipe'

// @Component({
//   selector: 'app-home',
//   imports: [RouterLink, TruncatePipe],
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.scss',
// })
// export class HomeComponent {
//   private postService = inject(PostsService)

//   isLoading = this.postService.isLoading
//   posts = this.postService.newPosts
// }

import { Component, OnInit } from '@angular/core'
import { ArticleService } from '../services/article.service'
import { Observable, forkJoin, of, from, lastValueFrom } from 'rxjs'
import { map, switchMap, filter } from 'rxjs/operators'
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  RouterLink,
} from '@angular/router'
import { Article } from '../model/article.type'
import { AsyncPipe } from '@angular/common'
import { TruncatePipe } from '../pipes/truncate.pipe'
import { NgFor } from '@angular/common'

type ArticleItem = Article & {
  tag_names: string[]
  comments: string[]
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [NgFor, AsyncPipe, TruncatePipe, RouterLink],
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  mergedArray$: Observable<ArticleItem[]>

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute
  ) {
    this.mergedArray$ = this.route.params.pipe(
      switchMap((params) => {
        return from(this.getQuestions(1))
      })
    )
  }

  async getQuestions(page: number): Promise<ArticleItem[]> {
    const articles$ = this.articleService.getArticles(page)
    const articles = await lastValueFrom(articles$)

    const tagIDs = articles.map((article) => article.tags).join(',')
    const tags$ = this.articleService.getTags(tagIDs)
    const tags = await lastValueFrom(tags$)

    const articleIDs = articles.map((question) => question.id).join(',')
    const comments$ = this.articleService.getComments(articleIDs)
    const comments = await lastValueFrom(comments$)

    const result = articles.map((article) => {
      const relatedTags = article.tags
        .map((tag_ID) => tags.find((tag) => tag.id == tag_ID)?.name)
        .filter((exists) => !!exists)

      const relatedComments = comments.filter(
        (answer) => answer.post === article.id
      )

      return {
        ...article,
        tag_names: relatedTags,
        comments: relatedComments,
      }
    })

    return result as any
  }

  getQuestionCount() {
    return null
  }

  goToPage(page: number) {
    console.log(page)
  }

  ngOnInit(): void {
    this.getQuestionCount()
  }
}
