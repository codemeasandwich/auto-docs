
//=====================================================
//======================================== How to login
//=====================================================

function githubPage(createPage, { description, screenshot, typeText, click, title, youtube,  }){

  createPage(() => {
          title(`From the github page`)

        screenshot(`auto-docs github page`,false)

    description(`click the "clone or download" button`)

          click(`.get-repo-select-menu > summary.btn.btn-sm.btn-primary`)

      screenshot(`auto-docs github page: download button`,false)

  },`auto-docs`)

}

module.exports = githubPage
