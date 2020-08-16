const fs = require('fs')
const path = require('path')

const currentPath = process.cwd()
var projectTitle;
var projectDescription;
var readme;
var folderPath = path.join(currentPath, 'READMES')
var headerValueMap = new Map()

var gettingStarted = '## Getting Started'
var prerequisites = '### Prerequisites'
var installation = '### Installation'
var testing = '## Testing'
var unitTest = '### Unit Tests'
var endToEnd = '### End-to-End Tests'
var deployment = '## Deployment'
var authors = '## Authors'
var license = '## License'

function openFile(fileName) {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir)
    }
  return fs.createWriteStream((folderPath, fileName),
    { flags: 'w+' })
}

async function start() {
  console.log("What is the title of your project?\n")
  projectTitle = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      var title = data.toString().trim()
      readme = openFile(`${title}.md`)
      resolve(title);
    })
  })
  console.log(`\nGive an overview of your project\n`)
  projectDescription = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      var note = data.toString().trim()
      resolve(note);
    })
  })
  headerValueMap.set(projectTitle, projectDescription)

  console.log("\nGetting Started\n")
  console.log('List out your project prerequisites. Separate items with a ","\n')
  var preq = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      var items = data.toString().trim().split(',').map((item) => {
        return item.trim()
      })
      resolve(items);
    })
  })
  console.log("\nList out your installation steps. Separate items with a ','. Put code samples for any item within '{}'\n")
  var instSteps = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      var items = data.toString().trim().split(',').map((item) => {
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
  var testDescription = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      var note = data.toString().trim()
      resolve(note);
    })
  })
  console.log(`\nGive an breakdown of available Unit tests.\nWhere there are none, simply press 'enter'.\nPut any code samples within '{}'\n`)
  var unit = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      var note = data.toString().trim()
      resolve(note);
    })
  })
  console.log(`\nGive an breakdown of available End-to-End tests.\nWhere there are none, simply press 'enter'.\nPut any code samples within '{}'\n`)
  var end = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      var note = data.toString().trim()
      resolve(note);
    })
  })
  headerValueMap.set(testing, testDescription)
  headerValueMap.set(unitTest, unit)
  headerValueMap.set(endToEnd, end)

  console.log('\nDeployment\n')
  console.log(`Give an breakdown of the deployment process\n`)
  var deploy = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      var note = data.toString().trim()
      resolve(note);
    })
  })
  headerValueMap.set(deployment, deploy)

  console.log(`\nAuthors\n`)
  console.log('List out the authors. Separate items with a ","\n')
  var auth = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      var items = data.toString().trim().split(',').map((item) => {
        return item.trim()
      })
      resolve(items);
    })
  })
  headerValueMap.set(authors, auth)

  console.log(`\License\n`)
  console.log('Which License type is this work licensed under\n')
  var lic = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      var note = data.toString().trim()
      resolve(note);
    })
  })
  headerValueMap.set(license, lic)

  console.log("Provide your Readme header names, separated by commas")
  headersArray = await new Promise(function(resolve, reject) {
    process.stdin.once("data", function(data) {
      var arr = data.toString().trim().split(',').map((header) => {
        return header.trim()
      })
      resolve(arr);
    });
  });
}

function setTitle(title, description) {
  var heading = `# ${title}\n`
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

var str = 'visit Microsoft!'
var res = str.replace("M", "\n\n		").replace("!", "\n");
var x = start().then(() => {
  console.log("Done! Check 'Readmes' directory for your Readme file\n")
  openFile(projectTitle)
  writeToFile()
  console.log(`Title: ${projectTitle}\n`)
  console.log(`${headerValueMap.entries()}`)
  process.stdin.pause();
});

function writeToFile() {
  var list;
  var codeString;

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
      readme.write(`${item}\n`)
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