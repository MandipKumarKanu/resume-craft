// utils/templateV3.js - Creative Edge Template

const generateCVLatexTemplateV3 = (parsedData) => {
    // Helper function to escape LaTeX special characters
    const escapeLaTeX = (text) => {
        if (!text) return '';
        const str = String(text);
        return str
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/[&%$#_{}~^]/g, '\\$&')
            .replace(/\[/g, '{[}')
            .replace(/\]/g, '{]}');
    };

    // Helper function to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch {
            return '';
        }
    };

    // Helper function to create hyperlinks
    const createHyperlink = (text, url) => {
        if (!text || !url) return escapeLaTeX(text || '');
        return `\\href{${escapeLaTeX(url)}}{${escapeLaTeX(text)}}`;
    };

    // Creative Edge LaTeX template with error handling
    const sections = parsedData.cv_template.sections;
    const header = sections.header || {};
    
    let latex = `\\documentclass[a4paper,11pt]{article}
\\usepackage[margin=0.8in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{fontawesome5}
\\usepackage{microtype}

% Creative color palette
\\definecolor{primarycolor}{RGB}{46, 125, 50}     % Forest green
\\definecolor{accentcolor}{RGB}{255, 87, 34}      % Deep orange
\\definecolor{darkgray}{RGB}{66, 66, 66}          % Dark gray
\\definecolor{lightgray}{RGB}{158, 158, 158}      % Light gray
\\definecolor{linkcolor}{RGB}{21, 101, 192}       % Blue

% Modern section formatting with creative edge
\\titleformat{\\section}
    {\\color{primarycolor}\\Large\\bfseries\\sffamily}
    {}
    {0em}
    {}
    [\\vspace{2pt}{\\color{accentcolor}\\titlerule[2pt]}\\vspace{6pt}]

\\titlespacing*{\\section}{0pt}{18pt}{8pt}

% Creative subsection formatting
\\titleformat{\\subsection}
    {\\color{darkgray}\\large\\bfseries\\sffamily}
    {}
    {0em}
    {}

\\titlespacing*{\\subsection}{0pt}{12pt}{4pt}

\\hypersetup{
    colorlinks=true,
    linkcolor=linkcolor,
    urlcolor=linkcolor,
    pdfborder={0 0 0}
}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{4pt}

% Creative custom commands
\\newcommand{\\cvitem}[2]{
    \\noindent\\textbf{\\color{primarycolor}#1:} \\color{darkgray}#2\\vspace{3pt}
}

\\newcommand{\\workentry}[4]{
    \\noindent\\textbf{\\color{primarycolor}#1} \\hfill \\textbf{\\color{accentcolor}#4}\\\\
    \\textit{\\color{darkgray}#2}%
    \\if\\relax\\detokenize{#3}\\relax\\else\\ -- \\textit{\\color{lightgray}#3}\\fi\\\\
    \\vspace{4pt}
}

\\newcommand{\\contactsep}{\\quad\\textcolor{accentcolor}{\\textbullet}\\quad}

\\begin{document}

% Creative Header with subtle color accents`;

    // Build header with safe property access
    const name = escapeLaTeX(header.name || 'Name Not Provided');
    const title = escapeLaTeX(header.title || '');
    const contactInfo = header.contact_info || {};
    
    // Safely build contact sections
    const contactSections = [];
    
    if (contactInfo.email?.value) {
        contactSections.push(createHyperlink(contactInfo.email.value, contactInfo.email.link || `mailto:${contactInfo.email.value}`));
    }
    
    if (contactInfo.phone?.value) {
        contactSections.push(createHyperlink(contactInfo.phone.value, contactInfo.phone.link || `tel:${contactInfo.phone.value}`));
    }
    
    if (contactInfo.location?.value) {
        contactSections.push(escapeLaTeX(contactInfo.location.value));
    }
    
    if (contactInfo.portfolio?.value) {
        contactSections.push(createHyperlink('Portfolio', contactInfo.portfolio.link || contactInfo.portfolio.value));
    }
    
    if (contactInfo.github?.value) {
        contactSections.push(createHyperlink('GitHub', contactInfo.github.link || contactInfo.github.value));
    }
    
    if (contactInfo.linkedin?.value) {
        contactSections.push(createHyperlink('LinkedIn', contactInfo.linkedin.link || contactInfo.linkedin.value));
    }

    latex += `
\\begin{center}
    {\\Huge\\bfseries\\color{primarycolor}${name}} \\\\[6pt]
    ${title ? `{\\Large\\color{accentcolor}${title}} \\\\[8pt]` : ''}
    ${contactSections.length > 0 ? `{\\normalsize\\color{darkgray}${contactSections.join(' \\contactsep ')}}` : ''}
\\end{center}

\\vspace{12pt}
`;

    // Summary with creative styling
    if (sections.summary && sections.summary.content) {
        latex += `
\\section{${escapeLaTeX(sections.summary.section_title || 'Professional Summary')}}
\\noindent\\color{darkgray}${escapeLaTeX(sections.summary.content)}

\\vspace{8pt}
`;
    }

    // Experience with creative formatting
    if (sections.experience && sections.experience.items && sections.experience.items.length > 0) {
        latex += `\\section{${escapeLaTeX(sections.experience.section_title || 'Professional Experience')}}\n`;
        sections.experience.items.forEach(item => {
            const startDate = item.dates?.start ? formatDate(item.dates.start) : '';
            const endDate = item.dates?.is_current ? 'Present' : (item.dates?.end ? formatDate(item.dates.end) : '');
            const dateRange = (startDate || endDate) ? `${startDate}${startDate && endDate ? ' -- ' : ''}${endDate}` : '';
            
            latex += `
\\workentry{${escapeLaTeX(item.title || '')}}{${escapeLaTeX(item.company || '')}}{${escapeLaTeX(item.location || '')}}{${dateRange}}
`;
            if (item.achievements && item.achievements.length > 0) {
                latex += `\\begin{itemize}[leftmargin=12pt, rightmargin=0pt, itemsep=1pt, topsep=3pt]\n`;
                item.achievements.forEach(achievement => {
                    latex += `    \\item \\color{darkgray}${escapeLaTeX(achievement)}\n`;
                });
                latex += `\\end{itemize}\n`;
            }
            
            if (item.technologies && item.technologies.length > 0) {
                latex += `\\textbf{\\color{primarycolor}Technologies:} \\color{darkgray}${item.technologies.map(tech => escapeLaTeX(tech)).join(', ')}\n`;
            }
            
            latex += `\\vspace{6pt}\n\n`;
        });
    }

    // Education with creative styling
    if (sections.education && sections.education.items && sections.education.items.length > 0) {
        latex += `\\section{${escapeLaTeX(sections.education.section_title || 'Education')}}\n`;
        sections.education.items.forEach(item => {
            const startDate = item.dates?.start ? formatDate(item.dates.start) : '';
            const endDate = item.dates?.end ? formatDate(item.dates.end) : '';
            const dateRange = (startDate || endDate) ? `${startDate}${startDate && endDate ? ' -- ' : ''}${endDate}` : '';
            
            latex += `\\workentry{${escapeLaTeX(item.degree || '')}}{${escapeLaTeX(item.institution || '')}}{${escapeLaTeX(item.location || '')}}{${dateRange}}\n`;
            
            if (item.gpa) {
                latex += `\\textbf{\\color{primarycolor}GPA:} \\color{darkgray}${escapeLaTeX(item.gpa)}\n`;
            }
            
            if (item.honors && item.honors.length > 0) {
                latex += `\\begin{itemize}[leftmargin=12pt, rightmargin=0pt, itemsep=1pt, topsep=3pt]\n`;
                item.honors.forEach(honor => {
                    latex += `    \\item \\color{darkgray}${escapeLaTeX(honor)}\n`;
                });
                latex += `\\end{itemize}\n`;
            }
            
            latex += `\\vspace{6pt}\n\n`;
        });
    }

    // Skills with creative categorization
    if (sections.skills && sections.skills.categories && sections.skills.categories.length > 0) {
        latex += `\\section{${escapeLaTeX(sections.skills.section_title || 'Technical Skills')}}\n`;
        sections.skills.categories.forEach(category => {
            const categoryName = category.name || '';
            const skills = category.items || [];
            if (skills.length > 0) {
                latex += `\\cvitem{${categoryName}}{${skills.map(skill => escapeLaTeX(skill)).join(', ')}}\n`;
            }
        });
        latex += `\\vspace{6pt}\n`;
    }

    // Projects with creative presentation
    if (sections.projects && sections.projects.items && sections.projects.items.length > 0) {
        latex += `\\section{${escapeLaTeX(sections.projects.section_title || 'Projects')}}\n`;
        sections.projects.items.forEach(item => {
            const startDate = item.dates?.start ? formatDate(item.dates.start) : '';
            const endDate = item.dates?.end ? formatDate(item.dates.end) : '';
            const dateRange = (startDate || endDate) ? `${startDate}${startDate && endDate ? ' -- ' : ''}${endDate}` : '';
            
            // Project title and date on separate lines for safety
            latex += `\\subsection{${createHyperlink(item.title || '', item.url || '')}}\n`;
            if (dateRange) {
                latex += `\\noindent{\\color{accentcolor}\\textit{${dateRange}}}\\vspace{2pt}\n`;
            }
            
            if (item.description) {
                latex += `\\noindent\\color{darkgray}${escapeLaTeX(item.description)}\n`;
            }
            
            if (item.key_contributions && item.key_contributions.length > 0) {
                latex += `\\begin{itemize}[leftmargin=12pt, rightmargin=0pt, itemsep=1pt, topsep=3pt]\n`;
                item.key_contributions.forEach(contribution => {
                    latex += `    \\item \\color{darkgray}${escapeLaTeX(contribution)}\n`;
                });
                latex += `\\end{itemize}\n`;
            }
            
            if (item.technologies && item.technologies.length > 0) {
                latex += `\\textbf{\\color{primarycolor}Technologies:} \\color{darkgray}${item.technologies.map(tech => escapeLaTeX(tech)).join(', ')}\n`;
            }
            
            latex += `\\vspace{6pt}\n\n`;
        });
    }

    // Achievements with creative styling
    if (sections.achievements && sections.achievements.items && sections.achievements.items.length > 0) {
        latex += `\\section{${escapeLaTeX(sections.achievements.section_title || 'Awards and Achievements')}}\n`;
        sections.achievements.items.forEach(item => {
            const date = item.date ? formatDate(item.date) : '';
            latex += `\\workentry{${escapeLaTeX(item.description || '')}}{${escapeLaTeX(item.organization || '')}}{}{${date}}\n`;
            latex += `\\vspace{6pt}\n\n`;
        });
    }

    latex += `\\end{document}`;
    
    return latex;
};

module.exports = {
    generateCVLatexTemplateV3
};
