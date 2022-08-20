const { join, basename } = require('path')
const { readdirSync, statSync } = require('fs')

const cwd = process.cwd()

function getProjectPath(...args) {
  return join(cwd, ...args)
}

function getDocsPath(...args) {
  return getProjectPath('docs', ...args)
}

function traverseDirectory(path, visitor, isRoot = true, parent = null) {
  if (!path || !visitor) {
    return
  }

  const pathStatus = statSync(path)
  if (pathStatus.isFile() && typeof visitor.file === 'function') {
    visitor.file(basename(path), path, isRoot, parent)
    return
  } 

  if (!pathStatus.isDirectory()) {
    return
  }

  if (typeof visitor.dir === 'function') {
    visitor.dir(basename(path), path, isRoot, parent)
  }

  const dirs = readdirSync(path)
  for (const dir of dirs) {
    traverseDirectory(join(path, dir), visitor, false, basename(path))
  }
}

module.exports = {
  getProjectPath,
  getDocsPath,
  traverseDirectory
}
