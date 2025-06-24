const getLatexPrompt = async (extractedData, CV_STRUCTURE) => {
  return `Convert the following extracted PDF data into a structured JSON format using the provided CV structure. Make sure to accurately extract and organize all information from the text and links.

Extracted Data:
${JSON.stringify(extractedData, null, 2)}

Required JSON Structure:
${CV_STRUCTURE}

Instructions:
1. Extract all relevant information from the provided data
2. Map the information to the appropriate sections in the CV structure
3. Ensure all URLs and links are properly formatted
4. Return only valid JSON without any markdown formatting
5. If a section has no data, you may omit it or include it with empty items array
6. Be thorough in extracting skills, experience, education, and other details

Return the JSON response:`;
};

const getLatexPromptJobTitle = async (
  extractedData,
  jobTitle,
  CV_STRUCTURE
) => {
  return `Convert the following extracted PDF data into a structured JSON format using the provided CV structure. Tailor the CV content to highlight relevant experience and skills for the job title: "${jobTitle}".

Extracted Data:
${JSON.stringify(extractedData, null, 2)}

Target Job Title: ${jobTitle}

Required JSON Structure:
${CV_STRUCTURE}

Instructions:
1. Extract all relevant information from the provided data
2. Emphasize skills and experience relevant to "${jobTitle}"
3. Prioritize and highlight achievements that align with the job title
4. Map the information to the appropriate sections in the CV structure
5. Ensure all URLs and links are properly formatted
6. Return only valid JSON without any markdown formatting
7. Tailor the summary section to align with the job title
8. Order experience items by relevance to the target role

Return the JSON response:`;
};

const getLatexPromptJobDescription = async (
  extractedData,
  jobTitle,
  jobDescription,
  CV_STRUCTURE
) => {
  return `Convert the following extracted PDF data into a structured JSON format using the provided CV structure. Tailor the CV content specifically for this job opportunity.

Extracted Data:
${JSON.stringify(extractedData, null, 2)}

Target Job Title: ${jobTitle}

Job Description:
${jobDescription}

Required JSON Structure:
${CV_STRUCTURE}

Instructions:
1. Extract all relevant information from the provided data
2. Tailor the content specifically to match the job description requirements
3. Highlight skills, technologies, and experience mentioned in the job description
4. Rewrite achievements and responsibilities to align with job requirements
5. Prioritize relevant experience and skills
6. Map the information to the appropriate sections in the CV structure
7. Ensure all URLs and links are properly formatted
8. Return only valid JSON without any markdown formatting
9. Customize the summary section to directly address the job requirements
10. Use keywords from the job description where appropriate

Return the JSON response:`;
};

module.exports = {
  getLatexPrompt,
  getLatexPromptJobTitle,
  getLatexPromptJobDescription,
};
