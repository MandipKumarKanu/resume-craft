// utils/templateV3.js

const generateCVLatexTemplateV3 = (parsedData) => {
    // Minimal and clean LaTeX template V3
    const sections = parsedData.cv_template.sections;
    const header = sections.header;
    
    let latex = `\\documentclass[a4paper,12pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{titlesec}

\\definecolor{darkblue}{RGB}{0,0,139}

\\titleformat{\\section}{\\color{darkblue}\\large\\bfseries\\uppercase}{}{0em}{}[\\color{darkblue}\\hrule]

\\hypersetup{
    colorlinks=true,
    linkcolor=darkblue,
    urlcolor=darkblue
}

\\setlength{\\parindent}{0pt}

\\begin{document}

% Clean Header
\\begin{center}
    {\\LARGE \\textbf{${header.name}}} \\\\[8pt]
    ${header.title} \\\\[5pt]
    \\href{mailto:${header.contact_info.email.value}}{${header.contact_info.email.value}} \\textbullet\\ 
    ${header.contact_info.phone.value} \\textbullet\\ 
    \\href{${header.contact_info.linkedin.link}}{LinkedIn} \\textbullet\\ 
    ${header.contact_info.location.value}
\\end{center}

\\vspace{15pt}
`;

    // Summary
    if (sections.summary && sections.summary.content) {
        latex += `
\\section{Summary}
${sections.summary.content}

\\vspace{10pt}
`;
    }

    // Experience
    if (sections.experience && sections.experience.items && sections.experience.items.length > 0) {
        latex += `\\section{Experience}\n`;
        sections.experience.items.forEach(item => {
            latex += `
\\textbf{${item.title}} \\hfill ${item.dates.start} -- ${item.dates.end || 'Present'} \\\\
${item.company}, ${item.location}
`;
            if (item.achievements && item.achievements.length > 0) {
                latex += `\\begin{itemize}[leftmargin=15pt, rightmargin=0pt, itemsep=2pt]\n`;
                item.achievements.forEach(achievement => {
                    latex += `    \\item ${achievement}\n`;
                });
                latex += `\\end{itemize}\n`;
            }
            latex += `\\vspace{8pt}\n\n`;
        });
    }

    // Education
    if (sections.education && sections.education.items && sections.education.items.length > 0) {
        latex += `\\section{Education}\n`;
        sections.education.items.forEach(item => {
            latex += `\\textbf{${item.degree}} \\hfill ${item.dates.start} -- ${item.dates.end} \\\\\n`;
            latex += `${item.institution}, ${item.location}`;
            if (item.gpa) latex += ` \\textbullet\\ GPA: ${item.gpa}`;
            latex += `\n\\vspace{5pt}\n\n`;
        });
    }

    // Skills
    if (sections.skills && sections.skills.categories && sections.skills.categories.length > 0) {
        latex += `\\section{Skills}\n`;
        sections.skills.categories.forEach(category => {
            latex += `\\textbf{${category.name}:} ${category.items.join(', ')}\n\\vspace{3pt}\n\n`;
        });
    }

    // Projects
    if (sections.projects && sections.projects.items && sections.projects.items.length > 0) {
        latex += `\\section{Projects}\n`;
        sections.projects.items.forEach(item => {
            latex += `\\textbf{${item.title}}`;
            if (item.url) latex += ` (\\href{${item.url}}{Link})`;
            latex += ` \\hfill ${item.dates.start} -- ${item.dates.end} \\\\\n`;
            latex += `${item.description}\n\\vspace{5pt}\n\n`;
        });
    }

    latex += `\\end{document}`;
    
    return latex;
};

module.exports = {
    generateCVLatexTemplateV3
};
