import { Injectable } from '@angular/core';
import { Post } from '../model/post.type';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  postItems: Array<Post> = [
    {
      id: 2222,
      slug: 'some-king-of-title',
      status: 'publish',
      title: {
        rendered: 'Some kind of title'
      }
    },
    {
      id: 1577,
      slug: 'another-not-that-long-article-title',
      status: 'publish',
      title: {
        rendered: 'Another not that long article title'
      }
    }
  ]
  constructor() { }
}
