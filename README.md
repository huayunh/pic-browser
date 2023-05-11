# pic-browser

[![Deploy static content to Pages](https://github.com/huayunh/pic-browser/actions/workflows/static.yml/badge.svg)](https://github.com/huayunh/pic-browser/actions/workflows/static.yml)

Given a picture, select if it is over exposed, normal or under exposed.

## Run Locally

```
npm install && npm run start
```

Will spin up the server

visit

```
http://localhost:3000/pic-browser/build?set=<set number>
```

will give you a specific image set (default to set 1).

To add images, simply modify the `/public` folder and `src/InterraterImageFilenames.ts` to include list of image names.

When ready to push to GitHub, run

```
npm run build
```

will build something ready to deploy for GH pages
