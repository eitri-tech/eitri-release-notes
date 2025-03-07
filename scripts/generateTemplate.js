import * as fs from 'fs';
import * as yaml from 'yaml';

const date = new Date();
let currentDate = new Intl.DateTimeFormat("ban", {day: '2-digit', month: '2-digit', year: 'numeric'}).format(date)
currentDate = currentDate.replace(/\//g, '-')

/**
 * 
 * @param {string} sectionName 
 */
function createSection(sectionName, finalSection = false) {
    let sectionString = `## ${sectionName} v.X.X.X\n\n`
    sectionString += createH3Section("Novas feautres")
    sectionString += createH3Section("Correções")
    sectionString += createH3Section("Outras mudanças")

    const sectionTerminator = finalSection ? '\n' : '\n\n'
    sectionString += `---${sectionTerminator}`
    return sectionString
}


function createH3Section(title) {
    const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent viverra 
    magna at mauris fringilla, non condimentum libero tristique. Praesent tempor ullamcorper purus, 
    nec pellentesque ex lacinia ac. Aliquam et odio.`

    return `### ${title}\n\n` + `#### Section Item\n\n${loremIpsum}\n\n`
}

function createPageTemplate() {
    const projects = ["Eitri Machine", "Eitri Shopping", "Eitri Play", "Eitri Luminus"]
    let fileContent = `# Release - ${currentDate}\n\n`

    for (let index = 0; index < projects.length; index++) {
        fileContent += createSection(projects[index], index === projects.length - 1)
    }
    fs.writeFileSync(`../pt/docs/${currentDate}.md`, fileContent)
}

function updateYaml() {
    const currentYaml = yaml.parseDocument(fs.readFileSync('../pt/mkdocs.yml', 'utf8')).toJSON()
    currentYaml.nav.push({[`Release - ${currentDate}`]: `${currentDate}.md`})
    const redirectsPluginIndex = currentYaml.plugins.findIndex(obj => Object.keys(obj)[0] === 'redirects')
    currentYaml.plugins[redirectsPluginIndex].redirects.redirect_maps['index.md'] = `${currentDate}.md`
    fs.writeFileSync('../pt/mkdocs.yml', yaml.stringify(currentYaml))
}

createPageTemplate()
updateYaml()