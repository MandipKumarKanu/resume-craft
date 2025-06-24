const {
  getLatexPrompt,
  getLatexPromptJobTitle,
  getLatexPromptJobDescription,
} = require("../services/promptServices");
const { generateCVLatexTemplateV1 } = require("../utils/templateV1");
const { generateCVLatexTemplateV2 } = require("../utils/templateV2");
const { generateCVLatexTemplate2_new } = require("../utils/templateV2_new");
const { generateCVLatexTemplateV3 } = require("../utils/templateV3");
const axios = require("axios");
require("dotenv").config();

const CV_STRUCTURE = `{
          "cv_template": {
            "metadata": {
              "section_order": [
                "header", "summary", "experience", "education", "skills", "projects", "certifications", "courses", "languages", "volunteer", "achievements", "publications", "interests", "references", 'patents', 'research', 'custom'
              ]
            },
            "sections": {
              "header": {
                "name": "Your Full Name",
                "title": "Your Professional Title, e.g., Software Engineer",
                "contact_info": {
                  "email": {"value": "Your Email", "link": "mailto:Your Email"},
                  "phone": {"value": "Your Phone Number", "link": "tel:Your Phone Number"},
                  "portfolio": {"value": "Your Portfolio URL", "link": "Your Portfolio URL"},
                  "linkedin": {"value": "Your LinkedIn Profile", "link": "LinkedIn Profile URL"},
                  "location": {"value": "City, Country"}
                }
              },
              "summary": {
                "section_title": "Summary",
                "content": "Brief professional summary highlighting your experience, skills, and career goals."
              },
              "experience": {
                "section_title": "Professional Experience",
                "items": [
                  {
                    "type": "job",
                    "title": "Job Title",
                    "company": "Company Name",
                    "url": "Company URL",
                    "location": "City, Country",
                    "dates": {"start": "Start Date", "end": "End Date", "is_current": false},
                    "achievements": [
                      "Achievement 1",
                      "Achievement 2"
                    ],
                    "technologies": ["Technology 1", "Technology 2"]
                  }
                ]
              },
              "education": {
                "section_title": "Education",
                "items": [
                  {
                    "degree": "Degree Title",
                    "institution": "Institution Name",
                    "url": "Institution URL",
                    "location": "City, Country",
                    "dates": {"start": "Start Date", "end": "End Date"},
                    "gpa": "GPA",
                    "honors": ["Honor or Award"]
                  }
                ]
              },
              "skills": {
                "section_title": "Skills",
                "categories": [
                  {
                    "name": "Technical Skills",
                    "items": ["Skill 1", "Skill 2"],
                    "description": "Short description based on data",
                    "proficiency": "expert"
                  },
                  {
                    "name": "Soft Skills",
                    "items": ["Skill 1", "Skill 2"],
                    "description": "Short description based on data",
                    "proficiency": "intermediate"
                  }
                ]
              },
              "projects": {
                "section_title": "Projects",
                "items": [
                  {
                    "title": "Project Title",
                    "url": "Project URL",
                    "description": "Project Description",
                    "dates": {"start": "Start Date", "end": "End Date"},
                    "technologies": ["Technology 1", "Technology 2"],
                    "key_contributions": ["Contribution 1", "Contribution 2"]
                  }
                ]
              },
              "certifications or courses": {
                "section_title": "Certifications",
                "items": [
                  {
                    "title": "Certification Name",
                    "institution": "Issuing Institution",
                    "url": "Certification URL",
                    "date": {"start": "Start Date", "end": "End Date"},
                  }
                ]
              },
              "languages": {
                "section_title": "Languages",
                "items": [
                  {"name": "Language", "proficiency": "Proficiency Level"}
                ]
              },
              "volunteer": {
                "section_title": "Volunteer Experience",
                "items": [
                  {
                    "title": "Volunteer Role",
                    "organization": "Organization Name",
                    "location": "City, Country",
                    "dates": {"start": "Start Date", "end": "End Date"},
                    "achievements": ["Achievement 1"]
                  }
                ]
              },
              "achievements": {
                section_title: "Awards & Achievements",
                items: [
                    {
                        organization: "Example Organization",
                        description: "Achievement description",
                        date: "2023-01-01"
                    }
                ]
              },
              "publications": {
                "section_title": "Publications",
                "items": [
                  {
                    "title": "Publication Title",
                    "url": "Publication URL",
                    "date": "Publication Date"
                  }
                ]
              },
              "interests": {
                "section_title": "Interests",
                "items": ["Interest 1", "Interest 2"]
              },
              "references": {
                "section_title": "References",
                "items": [
                  {
                    "name": "Reference Name",
                    "title": "Title",
                    "company": "Company Name",
                    "email": "Email",
                    "phone": "Phone Number"
                  }
                ]
              },

              patents: {
                section_title: "Patents",
                items: [
                    {
                        title: "Patent Title",
                        number: "Patent Number",
                        url: "Patent URL",
                        date: "2023-01-01"
                    }
                ]
              },
              research: {
                section_title: "Research",
                items: [
                    {
                        title: "Research Title",
                        description: "Research Description",
                        url: "Research URL",
                        date: "2023-01-01"
                    }
                ]
              },
              custom: {
                section_title: "Custom Section",
                items: [
                    {
                        title: "Custom Item Title",
                        description: "Custom Item Description",
                        url: "Custom Item URL",
                        date: "2023-01-01"
                    }
                ]
              }
            },
            "rendering_rules": {
              "date_format": "MMM YYYY",
              "hide_empty_sections": true,
              "max_items_per_section": "No limit for now",
              "truncate_descriptions_at": 600
            }
          }
        }`;

const ConvertLatex = async (req, res) => {
  const {
    extractedData,
    template,
    model: modelName,
    apiProvider,
    isTailoredResume,
    jobTitle,
    jobDescription,
  } = req.body;
  console.log("apiProvider", apiProvider);
  console.log("model", modelName);

  let apiKey;
  let latexContent;
  let mn;

  try {
    let LATEX_CONVERSION_PROMPT;
    if (isTailoredResume && jobTitle && jobDescription) {
      LATEX_CONVERSION_PROMPT = await getLatexPromptJobDescription(
        extractedData,
        jobTitle,
        jobDescription,
        CV_STRUCTURE
      );
    } else if (isTailoredResume && jobTitle) {
      LATEX_CONVERSION_PROMPT = await getLatexPromptJobTitle(
        extractedData,
        jobTitle,
        CV_STRUCTURE
      );
    } else {
      LATEX_CONVERSION_PROMPT = await getLatexPrompt(
        extractedData,
        CV_STRUCTURE
      );
    }

    if (modelName === "Qwen 32B") {
      mn = "qwen/qwen2.5-vl-32b-instruct:free";
      switch (apiProvider) {
        case "api_1":
          apiKey = process.env.OPENROUTER_API_KEY_1;
          break;
        case "api_2":
          apiKey = process.env.OPENROUTER_API_KEY_2;
          break;
        case "api_3":
          apiKey = process.env.OPENROUTER_API_KEY_3;
          break;
        case "api_4":
          apiKey = process.env.OPENROUTER_API_KEY_4;
          break;
        case "api_5":
          apiKey = process.env.OPENROUTER_API_KEY_5;
          break;
        default:
          return res
            .status(400)
            .json({ error: "Invalid API provider specified" });
      }

      if (!apiKey) {
        return res.status(500).json({
          error: "OpenRouter API key not configured for specified provider",
        });
      }

      console.log("Calling OpenRouter API with Qwen model");
      const openRouterResponse = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: mn,
          messages: [
            {
              role: "user",
              content: LATEX_CONVERSION_PROMPT,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      latexContent = openRouterResponse.data.choices[0].message.content;
      console.log("Response received from OpenRouter API");
    } else if (
      modelName === "Gemini 1.5 Pro" ||
      modelName === "Gemini 1.5 Flash" ||
      modelName === "Gemini 2.0 Flash"
    ) {
      if (modelName === "Gemini 1.5 Pro") {
        mn = "gemini-1.5-pro";
      } else if (modelName === "Gemini 1.5 Flash") {
        mn = "gemini-1.5-flash";
      } else if (modelName === "Gemini 2.0 Flash") {
        mn = "gemini-2.0-flash";
      }

      switch (apiProvider) {
        case "api_1":
          apiKey = process.env.GEMINI_API_KEY_1;
          break;
        case "api_2":
          apiKey = process.env.GEMINI_API_KEY_2;
          break;
        case "api_3":
          apiKey = process.env.GEMINI_API_KEY_3;
          break;
        case "api_4":
          apiKey = process.env.GEMINI_API_KEY_4;
          break;
        case "api_5":
          apiKey = process.env.GEMINI_API_KEY_5;
          break;
        default:
          return res
            .status(400)
            .json({ error: "Invalid API provider specified" });
      }

      if (!apiKey) {
        return res.status(500).json({
          error: "Gemini API key not configured for specified provider",
        });
      }

      console.log("Calling Gemini API with model:", mn);
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${mn}:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: LATEX_CONVERSION_PROMPT,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      latexContent = geminiResponse.data.candidates[0].content.parts[0].text;
      console.log("Response received from Gemini API");
    } else {
      return res.status(400).json({ error: "Unsupported model specified" });
    }

    console.log("Processing AI response");

    latexContent = latexContent
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    console.log(
      "Cleaned AI response (first 500 chars):",
      latexContent.substring(0, 500)
    );

    let parsedData;
    try {
      parsedData = JSON.parse(latexContent);
      console.log("Successfully parsed JSON structure");
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError.message);
      console.error("Raw response:", latexContent);
      return res.status(500).json({
        error: "Failed to parse AI response as JSON: " + parseError.message,
        rawResponse: latexContent.substring(0, 1000),
      });
    }

    let email, name, title;

    try {
      const headerSection = parsedData.cv_template?.sections?.header;
      email = headerSection?.contact_info?.email?.value || "email@example.com";
      name = headerSection?.name || "Your Name";
      title = headerSection?.title || "Your Title";

      if (headerSection?.contact_info) {
        const contactInfo = headerSection.contact_info;

        if (contactInfo.email && !contactInfo.email.link) {
          contactInfo.email.link = `mailto:${contactInfo.email.value || email}`;
        }
        if (contactInfo.phone && !contactInfo.phone.link) {
          contactInfo.phone.link = `tel:${contactInfo.phone.value || ""}`;
        }
        if (contactInfo.linkedin && !contactInfo.linkedin.link) {
          contactInfo.linkedin.link = contactInfo.linkedin.value || "#";
        }
        if (contactInfo.portfolio && !contactInfo.portfolio.link) {
          contactInfo.portfolio.link = contactInfo.portfolio.value || "#";
        }
      }
    } catch (extractError) {
      console.error("Error extracting header info:", extractError);
      email = "email@example.com";
      name = "Your Name";
      title = "Your Title";
    }

    console.log("email:", email);
    console.log("name:", name);
    console.log("title:", title);

    let formattedLatex;
    try {
      if (template === "v2_new") {
        formattedLatex = generateCVLatexTemplate2_new(parsedData);
      } else if (template === "v2") {
        formattedLatex = generateCVLatexTemplateV2(parsedData);
      } else if (template === "v1") {
        formattedLatex = generateCVLatexTemplateV1(parsedData);
      } else {
        formattedLatex = generateCVLatexTemplateV3(parsedData);
      }
    } catch (templateError) {
      console.error("Error generating LaTeX template:", templateError);
      return res.status(500).json({
        error: "Failed to generate LaTeX template: " + templateError.message,
        parsedData: parsedData,
      });
    }

    res.json({ formattedLatex, email, name, title });
  } catch (error) {
    console.error("LaTeX conversion error:", error);
    res
      .status(500)
      .json({ error: "Failed to convert to LaTeX: " + error.message });
  }
};

module.exports = { ConvertLatex };
