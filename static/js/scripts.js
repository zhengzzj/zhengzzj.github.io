const contentDir = 'contents/';
const configFile = 'config.yml';
const sectionNames = ['about', 'news', 'publications', 'awards'];

function setElementValue(id, value) {
    const element = document.getElementById(id);
    if (!element || value === undefined || value === null) {
        return;
    }

    if (element.tagName === 'A' && id.endsWith('-link')) {
        element.href = value;
        return;
    }

    element.innerHTML = value;
}

function secureExternalLinks(container) {
    container.querySelectorAll('a[href^="http"]').forEach(link => {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });
}

window.addEventListener('DOMContentLoaded', () => {
    fetch(contentDir + configFile)
        .then(response => response.text())
        .then(text => {
            const config = jsyaml.load(text);
            Object.keys(config).forEach(key => setElementValue(key, config[key]));
        })
        .catch(error => console.log(error));

    marked.use({ mangle: false, headerIds: false });

    sectionNames.forEach(name => {
        fetch(contentDir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const section = document.getElementById(name + '-md');
                section.innerHTML = marked.parse(markdown);
                secureExternalLinks(section);
            })
            .then(() => {
                if (window.MathJax && typeof MathJax.typeset === 'function') {
                    MathJax.typeset();
                }
            })
            .catch(error => console.log(error));
    });
});
