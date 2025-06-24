const generateCVLatexTemplateV1 = (cvData) => {
    // Helper function to escape LaTeX special characters
    const escapeLaTeX = (text) => {
        if (!text) return '';
        // Convert to string if text is not already a string
        const str = String(text);
        return str
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/[&%$#_{}~^]/g, '\\$&')
            .replace(/\[/g, '{[}')
            .replace(/\]/g, '{]}');
    };

    // Helper function to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Present';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return 'Present';
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch {
            return 'Present';
        }
    };

    // Helper function to create hyperlinks
    const createHyperlink = (text, url) => {
        if (!text || !url) return escapeLaTeX(text || '');
        return `\\href{${escapeLaTeX(url)}}{${escapeLaTeX(text)}}`;
    };

    // Helper function to create list items
    const createListItems = (items) => {
        if (!items || !items.length) return '';
        return items.map(item => `  \\item ${escapeLaTeX(item)}`).join('\n');
    };

    // Generate LaTeX document header - Modern Professional & ATS-Friendly
    const generateHeader = () => `\\documentclass[11pt,a4paper]{article}
  
  % Essential packages for modern, ATS-friendly CV
  \\usepackage[utf8]{inputenc}
  \\usepackage[T1]{fontenc}
  \\usepackage{lmodern}          % Better font rendering
  \\usepackage{microtype}        % Improved typography
  \\usepackage{hyperref}
  \\usepackage{geometry}
  \\usepackage{enumitem}
  \\usepackage{titlesec}
  \\usepackage{xcolor}
  \\usepackage{tabularx}         % Better table formatting
  
  % Modern color palette - professional and ATS-safe
  \\definecolor{primarycolor}{RGB}{47, 79, 79}      % Dark slate gray
  \\definecolor{accentcolor}{RGB}{70, 130, 180}     % Steel blue
  \\definecolor{textcolor}{RGB}{33, 37, 41}         % Dark gray
  \\definecolor{lightgray}{RGB}{248, 249, 250}      % Light background
  
  % Optimized page margins for professional appearance
  \\geometry{
    top=0.8in,
    bottom=0.8in,
    left=0.75in,
    right=0.75in,
    headheight=0pt,
    headsep=0pt,
    footskip=0.3in
  }
  
  % Clean spacing configuration
  \\setlength{\\parindent}{0pt}
  \\setlength{\\parskip}{0pt}
  \\setlength{\\baselineskip}{14pt}
  
  % Modern section formatting - ATS-friendly
  \\titleformat{\\section}
    {\\color{primarycolor}\\Large\\bfseries\\sffamily}
    {}
    {0em}
    {}
    [\\vspace{2pt}{\\color{accentcolor}\\titlerule[1pt]}\\vspace{4pt}]
  
  \\titlespacing*{\\section}{0pt}{16pt}{8pt}
  
  % Clean subsection formatting
  \\titleformat{\\subsection}
    {\\color{primarycolor}\\large\\bfseries\\sffamily}
    {}
    {0em}
    {}
  
  \\titlespacing*{\\subsection}{0pt}{10pt}{4pt}
  
  % Professional list formatting
  \\setlist[itemize]{
    topsep=3pt,
    itemsep=1pt,
    parsep=0pt,
    leftmargin=1.2em,
    label={\\color{accentcolor}\\textbullet}
  }
  
  % ATS-friendly hyperlink configuration
  \\hypersetup{
    colorlinks=true,
    linkcolor=accentcolor,
    filecolor=accentcolor,
    urlcolor=accentcolor,
    pdfborder={0 0 0},
    pdfpagemode=UseNone,
    pdfstartview=FitH
  }
  
  % Modern custom commands
  \\newcommand{\\cvitem}[2]{
    \\noindent\\textbf{\\color{primarycolor}#1:} #2\\vspace{3pt}
  }
  
  \\newcommand{\\workitem}[4]{
    \\noindent
    \\begin{tabularx}{\\textwidth}{@{}X@{}r@{}}
      \\textbf{\\color{primarycolor}#1} & \\textbf{\\color{accentcolor}#4} \\\\
      \\textit{#2} & \\textit{#3} \\\\
    \\end{tabularx}
    \\vspace{2pt}
  }
  
  \\newcommand{\\contactsep}{\\color{lightgray}\\textbar\\color{textcolor}}
  
  % Set default text color
  \\color{textcolor}
  
  \\begin{document}`;

    // All section generator functions
    const sectionGenerators = {
        header: () => {
            const header = cvData.cv_template.sections.header;
            if (!header) return '';

            // Format contact information in a clean, ATS-friendly way
            const contactItems = [];
            if (header.contact_info.email?.value) {
                contactItems.push(createHyperlink(header.contact_info.email.value, header.contact_info.email.link));
            }
            if (header.contact_info.phone?.value) {
                contactItems.push(createHyperlink(header.contact_info.phone.value, header.contact_info.phone.link));
            }
            if (header.contact_info.location?.value) {
                contactItems.push(escapeLaTeX(header.contact_info.location.value));
            }
            if (header.contact_info.linkedin?.value) {
                contactItems.push(createHyperlink('LinkedIn', header.contact_info.linkedin.link));
            }
            if (header.contact_info.portfolio?.value) {
                contactItems.push(createHyperlink('Portfolio', header.contact_info.portfolio.link));
            }

            return `
  % Professional header - ATS optimized
  \\begin{center}
    {\\Huge\\bfseries\\color{primarycolor}${escapeLaTeX(header.name)}}\\\\[0.4em]
    {\\large\\color{accentcolor}${escapeLaTeX(header.title)}}\\\\[0.6em]
    {\\normalsize ${contactItems.join(' \\contactsep{} ')}}
  \\end{center}
  \\vspace{8pt}`;
        },

        summary: () => {
            const summary = cvData.cv_template.sections.summary;
            if (!summary || !summary.content) return '';

            return `
  \\section{${escapeLaTeX(summary.section_title || 'Professional Summary')}}
  \\noindent ${escapeLaTeX(summary.content)}
  \\vspace{6pt}`;
        },

        experience: () => {
            const experience = cvData.cv_template.sections.experience;
            if (!experience || !experience.items || !experience.items.length) return '';

            const experienceItems = experience.items.map(job => {
                const startDate = job.dates?.start ? formatDate(job.dates.start) : '';
                const endDate = job.dates?.is_current ? 'Present' : (job.dates?.end ? formatDate(job.dates.end) : '');
                const dateRange = (startDate || endDate) ? `${startDate}${startDate && endDate ? ' -- ' : ''}${endDate}` : '';

                let jobContent = '';
                
                // Use modern work item format
                if (job.company && job.title) {
                    jobContent += `\\workitem{${escapeLaTeX(job.title)}}{${createHyperlink(job.company, job.url || '')}}{${escapeLaTeX(job.location || '')}}{${dateRange}}\n`;
                }

                // Add achievements in a clean format
                if (job.achievements?.length) {
                    jobContent += `\\begin{itemize}[topsep=2pt]\n${createListItems(job.achievements)}\n\\end{itemize}\n`;
                }

                // Add technologies in a professional format
                if (job.technologies?.length) {
                    jobContent += `\\textbf{\\color{primarycolor}Technologies:} ${job.technologies.map(tech => escapeLaTeX(tech || '')).join(' | ')}\n`;
                }

                return jobContent + '\\vspace{6pt}';
            }).join('\n');

            return `
  \\section{${escapeLaTeX(experience.section_title || 'Professional Experience')}}
  ${experienceItems}`;
        },

        education: () => {
            const education = cvData.cv_template.sections.education;
            if (!education || !education.items || !education.items.length) return '';

            const educationItems = education.items.map(edu => {
                const startDate = edu.dates?.start ? formatDate(edu.dates.start) : '';
                const endDate = edu.dates?.end ? formatDate(edu.dates.end) : '';
                const dateRange = (startDate || endDate) ? `${startDate}${startDate && endDate ? ' -- ' : ''}${endDate}` : '';

                let eduContent = '';
                
                // Format education entry professionally
                eduContent += `\\workitem{${escapeLaTeX(edu.degree || '')}}{${createHyperlink(edu.institution || '', edu.url || '')}}{${escapeLaTeX(edu.location || '')}}{${dateRange}}\n`;

                // Add GPA if available
                if (edu.gpa) {
                    eduContent += `\\textbf{\\color{primarycolor}GPA:} ${escapeLaTeX(edu.gpa)}\\vspace{2pt}\n`;
                }

                // Add honors/achievements
                if (edu.honors?.length) {
                    eduContent += `\\begin{itemize}[topsep=2pt]\n${createListItems(edu.honors)}\n\\end{itemize}\n`;
                }

                return eduContent + '\\vspace{6pt}';
            }).join('\n');

            return `
  \\section{${escapeLaTeX(education.section_title || 'Education')}}
  ${educationItems}`;
        },

        skills: () => {
            const skills = cvData.cv_template.sections.skills;
            if (!skills || !skills.categories || !skills.categories.length) return '';

            const skillCategories = skills.categories.map(category => {
                let categoryContent = '';
                
                if (category.name) {
                    categoryContent += `\\textbf{\\color{primarycolor}${escapeLaTeX(category.name)}:} `;
                }
                
                if (category.items && category.items.length) {
                    categoryContent += category.items.map(skill => escapeLaTeX(skill)).join(', ');
                }
                
                if (category.description && !category.items?.length) {
                    categoryContent += escapeLaTeX(category.description);
                }
                
                return categoryContent;
            }).filter(content => content).join('\\\\[4pt]\n');

            return `
  \\section{${escapeLaTeX(skills.section_title || 'Technical Skills')}}
  \\noindent ${skillCategories}
  \\vspace{6pt}`;
        },

        projects: () => {
            const projects = cvData.cv_template.sections.projects;
            if (!projects || !projects.items || !projects.items.length) return '';

            const projectItems = projects.items.map(project => {
                const startDate = project.dates?.start ? formatDate(project.dates.start) : '';
                const endDate = project.dates?.end ? formatDate(project.dates.end) : '';
                const dateRange = (startDate || endDate) ? `${startDate}${startDate && endDate ? ' -- ' : ''}${endDate}` : '';
                
                let projectContent = '';
                
                // Project title and date
                projectContent += `\\subsection{${createHyperlink(project.title || '', project.url || '')}}`;
                if (dateRange) {
                    projectContent += `\\hfill {\\color{accentcolor}\\textit{${dateRange}}}\n`;
                } else {
                    projectContent += '\n';
                }
                
                // Project description
                if (project.description) {
                    projectContent += `\\noindent ${escapeLaTeX(project.description)}\n`;
                }

                // Key contributions
                if (project.key_contributions?.length) {
                    projectContent += `\\begin{itemize}[topsep=2pt]\n${createListItems(project.key_contributions)}\n\\end{itemize}\n`;
                }

                // Technologies used
                if (project.technologies?.length) {
                    projectContent += `\\textbf{\\color{primarycolor}Technologies:} ${project.technologies.map(tech => escapeLaTeX(tech || '')).join(', ')}\n`;
                }

                return projectContent + '\\vspace{6pt}';
            }).join('\n');

            return `
  \\section{${escapeLaTeX(projects.section_title || 'Projects')}}
  ${projectItems}`;
        },

        certifications: () => {
            const certifications = cvData.cv_template.sections.certifications;
            if (!certifications || !certifications.items || !certifications.items.length) return '';

            const certItems = certifications.items.map(cert => {
                const startDate = cert.date?.start ? formatDate(cert.date.start) : '';
                const endDate = cert.date?.end ? formatDate(cert.date.end) : 'Present';
                const dateInfo = startDate || endDate ? ` (${startDate}${startDate && endDate !== 'Present' ? ' - ' : ''}${endDate})` : '';

                return `\\cvitem{${createHyperlink(cert.title || '', cert.url || '')}}{${escapeLaTeX(cert.institution || '')}${dateInfo}}`;
            }).join('\n');

            return `
  \\section{${escapeLaTeX(certifications.section_title || 'Certifications')}}
  ${certItems}
  \\vspace{6pt}`;
        },

        courses: () => {
            const courses = cvData.cv_template.sections.courses;
            if (!courses?.items?.length) return '';
            
            // Filter out invalid items and format each course
            const validCourses = courses.items
                .filter(course => course && typeof course === 'object')
                .map(course => {
                    const title = escapeLaTeX(course.title || '');
                    const institution = course.institution ? ` at ${escapeLaTeX(course.institution)}` : '';
                    const location = course.location ? ` - ${escapeLaTeX(course.location)}` : '';
                    const startDate = course.dates?.start ? formatDate(course.dates.start) : '';
                    const endDate = course.dates?.end ? formatDate(course.dates.end) : 'Present';
                    const dates = startDate ? ` (${startDate} -- ${endDate})` : '';
                    
                    return `    \\item ${title}${institution}${location}${dates}`;
                });
                
            if (!validCourses.length) return '';

            return `
  \\section{${escapeLaTeX(courses.section_title || 'Courses')}}
  \\begin{itemize}[leftmargin=*]
${validCourses.join('\n')}
  \\end{itemize}`;
        },

        languages: () => {
            const languages = cvData.cv_template.sections.languages;
            if (!languages || !languages.items || !languages.items.length) return '';

            const languageItems = languages.items.map(lang =>
                `\\cvitem{${escapeLaTeX(lang.name)}}{${escapeLaTeX(lang.proficiency)}}`
            ).join('\n');

            return `
  \\section{${escapeLaTeX(languages.section_title)}}
  ${languageItems}`;
        },

        volunteer: () => {
            const volunteer = cvData.cv_template.sections.volunteer;
            if (!volunteer || !volunteer.items || !volunteer.items.length) return '';

            const volunteerItems = volunteer.items.map(vol => {
                const startDate = vol.dates?.start ? formatDate(vol.dates.start) : '';
                const endDate = vol.dates?.end ? formatDate(vol.dates.end) : '';

                return `
\\subsection*{${escapeLaTeX(vol.organization || '')}${vol.location ? ` -- ${escapeLaTeX(vol.location)}` : ''}}
\\textit{${escapeLaTeX(vol.title || '')}} \\hfill ${startDate}${startDate || endDate ? ' -- ' : ''}${endDate}

${vol.achievements?.length ? `\\begin{itemize}[leftmargin=*]
${createListItems(vol.achievements)}
\\end{itemize}` : ''}`
            }).join('\n\n');

            return `
  \\section{${escapeLaTeX(volunteer.section_title || 'Volunteer Experience')}}
  ${volunteerItems}`;
        },

        awards: () => {
            const awards = cvData.cv_template.sections.awards;
            if (!awards || !awards.items || !awards.items.length) return '';

            return `
  \\section{${escapeLaTeX(awards.section_title)}}
  \\begin{itemize}[leftmargin=*]
  ${createListItems(awards.items)}
  \\end{itemize}`;
        },

        publications: () => {
            const publications = cvData.cv_template.sections.publications;
            if (!publications || !publications.items || !publications.items.length) return '';

            const pubItems = publications.items.map(pub =>
                `\\cvitem{${createHyperlink(pub.title, pub.url)}}{${formatDate(pub.date)}}`
            ).join('\n');

            return `
  \\section{${escapeLaTeX(publications.section_title)}}
  ${pubItems}`;
        },

        interests: () => {
            const interests = cvData.cv_template.sections.interests;
            if (!interests || !interests.items || !interests.items.length) return '';

            return `
  \\section{${escapeLaTeX(interests.section_title)}}
  ${interests.items.map(interest => escapeLaTeX(interest)).join(' | ')}`;
        },

        references: () => {
            const references = cvData.cv_template.sections.references;
            if (!references || !references.items || !references.items.length) return '';

            const refItems = references.items.map(ref => `
  \\cvitem{${escapeLaTeX(ref.name)}}{
    ${escapeLaTeX(ref.title)}${ref.company ? `, ${escapeLaTeX(ref.company)}` : ''}\\\\
    ${ref.email ? `Email: ${escapeLaTeX(ref.email)}` : ''}${ref.phone ? ` | Phone: ${escapeLaTeX(ref.phone)}` : ''}
  }`).join('\n\n');

            return `
  \\section{${escapeLaTeX(references.section_title)}}
  ${refItems}`;
        }
    };

    // Get the section order from metadata
    const sectionOrder = cvData.cv_template.metadata.section_order || [];

    // Generate content based on metadata order
    const content = sectionOrder
        .map(sectionName => {
            const generator = sectionGenerators[sectionName];
            return generator ? generator() : '';
        })
        .filter(section => section !== '')
        .join('\n\n');

    // Combine everything
    return `${generateHeader()}
  
  ${content}
  
  \\end{document}`;
};

// Export the function
module.exports= { generateCVLatexTemplateV1 };