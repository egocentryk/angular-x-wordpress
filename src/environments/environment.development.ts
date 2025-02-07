export const environment = {
  production: false,
  api: {
    url: 'https://kolektyw.xyz/wp-json/wp/v2',
    paths: {
      author: '/users/',
      categories: '/categories',
      comments: '/comments?post=',
      posts: '/posts',
      tags: '/tags?include=',
    },
  },
}
