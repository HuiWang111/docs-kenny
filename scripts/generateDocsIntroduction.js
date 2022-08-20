const { writeFileSync } = require('fs')
const { basename } = require('path')
const {
  traverseDirectory,
  getDocsPath
} = require('./utils')
const { DocCategoryToChinese, DocIntroductionFileName, DocBasePath } = require('./constants')

function main() {
  let introduction = '# Introduction\n个人学习文档整理\n\n'

  traverseDirectory(getDocsPath(), {
    dir(path, fullPath, isRoot) {
      // 排除docs目录本身
      if (isRoot) return

      const chinese = DocCategoryToChinese[path] || '未知分类'
      
      introduction += `### ${chinese} \n`
    },
    file(path) {
      if (path === DocIntroductionFileName || path.startsWith('_')) {
        return
      }

      const docName = basename(path, '.md')
      introduction += ` - [${docName}](${DocBasePath}/${docName})\n`
    }
  })

  writeFileSync(getDocsPath(DocIntroductionFileName), introduction)
}

main()
