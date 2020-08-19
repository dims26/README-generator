const fs = require('fs')
const path = require('path')

const currentPath = process.cwd()
const folderPath = path.join(currentPath, 'READMES')
const headerValueMap = new Map()

let projectTitle;
let projectDescription;
let readme;

const gettingStarted = '## Getting Started'
const prerequisites = '### Prerequisites'
const installation = '### Installation'
const testing = '## Testing'
const unitTest = '### Unit Tests'
const endToEnd = '### End-to-End Tests'
const deployment = '## Deployment'
const authors = '## Authors'
const license = '## License'

function openFile(fileName) {
  if (!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath)
    }
  return fs.createWriteStream(path.join(folderPath, fileName),{ flags: 'w+' })
}

async function start() {
  console.log("What is the title of your project?\n")
  projectTitle = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      let title = data.toString().trim()
      readme = openFile(`${title}.md`)
      resolve(title);
    })
  })
  console.log(`\nGive an overview of your project\n`)
  projectDescription = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      let note = data.toString().trim()
      resolve(note);
    })
  })
  headerValueMap.set(projectTitle, projectDescription)

  console.log("\nGetting Started\n")
  console.log('List out your project prerequisites. Separate items with a ","\n')
  let preq = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      let items = data.toString().trim().split(',').map((item) => {
        return item.trim()
      })
      resolve(items);
    })
  })
  console.log("\nList out your installation steps. Separate items with a ','. Put code samples for any item within '{}'\n")
  let instSteps = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      let items = data.toString().trim().split(',').map((item) => {
        return item.trim()
      })
      resolve(items);
    })
  })
  headerValueMap.set(gettingStarted, 'The following directions will guide you to setting up a copy of this project.')
  headerValueMap.set(prerequisites, preq)
  headerValueMap.set(installation, instSteps)

  console.log("\nTesting\n")
  console.log('Give an overview of available tests, their location, and how to run them\n')
  let testDescription = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      let note = data.toString().trim()
      resolve(note);
    })
  })
  console.log(`\nGive an breakdown of available Unit tests.\nWhere there are none, simply press 'enter'.\nPut any code samples within '{}'\n`)
  let unit = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      let note = data.toString().trim()
      resolve(note);
    })
  })
  console.log(`\nGive an breakdown of available End-to-End tests.\nWhere there are none, simply press 'enter'.\nPut any code samples within '{}'\n`)
  let end = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      let note = data.toString().trim()
      resolve(note);
    })
  })
  headerValueMap.set(testing, testDescription)
  headerValueMap.set(unitTest, unit)
  headerValueMap.set(endToEnd, end)

  console.log('\nDeployment\n')
  console.log(`Give an breakdown of the deployment process\n`)
  let deploy = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      let note = data.toString().trim()
      resolve(note);
    })
  })
  headerValueMap.set(deployment, deploy)

  console.log(`\nAuthors\n`)
  console.log('List out the authors. Separate items with a ","\n')
  let auth = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      let items = data.toString().trim().split(',').map((item) => {
        return item.trim()
      })
      resolve(items);
    })
  })
  headerValueMap.set(authors, auth)

  console.log(`\License\n`)
  console.log('Which License type is this work licensed under\n')
  let lic = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      let note = data.toString().trim()
      resolve(note);
    })
  })
  headerValueMap.set(license, lic)
}

function setTitle(title, description) {
  let heading = `# ${title}\n`
  readme.write(heading)
  readme.write(`${description}\n`)
}

function identifyCode(str){
  if(str.includes("{") && str.includes("}")){
    return str.replace("{", "\n\n		").replace("}", "\n");
  }
  else { 
    return str
  }
}

console.log('**README FILE GENERATOR**\n\n')

let x = start().then(() => {
  console.log("Done! Check 'Readmes' directory for your Readme file\n")
  writeToFile()
  console.log(`Title: ${projectTitle}\n`)
  console.log(headerValueMap)
  process.stdin.pause();
});

function writeToFile() {
  let list;
  let codeString;

  setTitle(projectTitle, projectDescription)

  if(headerValueMap.get(gettingStarted).trim() !== ""){
    readme.write(`${gettingStarted}\n`)
    readme.write(`${headerValueMap.get(gettingStarted)}\n`)
  }

  list = headerValueMap.get(prerequisites)
    .filter(function(value, _, _) { return value !== '' })
  if (list.length > 0) {
    readme.write(`${prerequisites}\n`)
    list.forEach((item) => {
      readme.write(`- ${item}\n`)
    })
  }

  list = headerValueMap.get(installation)
  .filter(function(value, _, _) { return value !== '' })
  if (list.length > 0) {
    readme.write(`${installation}\n`)
    list.forEach((item) => {
      item = identifyCode(item)
      readme.write(`- ${item}\n`)
    })
  }

  if(headerValueMap.get(testing).trim() !== ""){
    readme.write(`${testing}\n`)
    readme.write(`${headerValueMap.get(testing)}\n`)
  }

  if(headerValueMap.get(unitTest).trim() !== ""){
    readme.write(`${unitTest}\n`)
    codeString = identifyCode(headerValueMap.get(unitTest))
    readme.write(codeString)
  }

  if(headerValueMap.get(endToEnd).trim() !== ""){
    readme.write(`${endToEnd}\n`)
    codeString = identifyCode(headerValueMap.get(endToEnd))
    readme.write(codeString)
  }

  if(headerValueMap.get(deployment).trim() !== ""){
    readme.write(`${deployment}\n`)
    readme.write(`${headerValueMap.get(deployment)}\n`)
  }

  list = headerValueMap.get(authors)
    .filter(function(value, _, _) { return value !== '' })
  if (list.length > 0) {
    readme.write(`${authors}\n`)
    list.forEach((item) => {
      readme.write(`- ${item}\n`)
    })
  }

  if(headerValueMap.get(license).trim() !== ""){
    readme.write(`${license}\n`)
    readme.write(`${headerValueMap.get(license)}\n`)
  }

  readme.close()
}