function cover(createPage, { description, img, title }){

  createPage(() => {
    img(`Person working at a desk`,`/pics/typing.jpg`)
    title(`Welcome to you manual`)
    description(`with a little help from ![auto-docs](https://www.npmjs.com/package/auto-docs)`)
  })

}

module.exports = cover
