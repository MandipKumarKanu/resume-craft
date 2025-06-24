# ✨ LaTeX CV Backend System

> Transform your dusty PDF resume into a stunning LaTeX masterpiece with the power of AI

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.16.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-FF6B6B?style=for-the-badge&logo=google&logoColor=white)](https://ai.google/)

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&duration=3000&pause=1000&center=true&vCenter=true&width=600&lines=Upload+PDF+%E2%86%92+AI+Magic+%E2%86%92+Beautiful+CV;Job-Specific+Tailoring;Professional+LaTeX+Templates;Cloud-Ready+%26+Scalable" alt="Typing SVG" />
</div>

---

## 🎯 **The Magic Behind the Scenes**

Your resume journey in 4 simple steps:

```
📄 Upload PDF  →  🤖 AI Analysis  →  🎨 LaTeX Beauty  →  ✨ Perfect CV
```

**Before**: "My resume looks like everyone else's..."  
**After**: "How did you make your CV look so professional?!" 

---

## 🔥 **What Makes This Special**

### 🧠 **AI-Powered Intelligence**
- **Smart Content Analysis**: Google's Generative AI reads between the lines
- **Job-Specific Optimization**: Tailors your CV for that dream role
- **Context-Aware Enhancement**: Understands what recruiters want to see

### 🎨 **Designer-Quality Templates**
- **Template V1**: `Modern Professional` - Clean, ATS-friendly
- **Template V2**: `Academic Excellence` - Perfect for research roles  
- **Template V2_new**: `Enhanced Classic` - Traditional with a twist
- **Template V3**: `Creative Edge` - Stand out with subtle color accents

### ⚡ **Lightning Fast Processing**
- **Smart PDF Parsing**: Extracts text, links, and formatting
- **Cloud-Native**: Cloudinary handles all the heavy lifting
- **Real-time Generation**: From upload to download in seconds

### 📊 **Built-in Analytics**
- Track your CV generation count
- Monitor system performance
- Usage insights and patterns

---

## 🚀 **Tech Stack That Powers the Magic**

<div align="center">

| **Backend** | **AI & Processing** | **Storage & Cloud** |
|:-----------:|:-------------------:|:-------------------:|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | ![Google AI](https://img.shields.io/badge/Google_AI-4285F4?style=flat-square&logo=google&logoColor=white) | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white) |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | ![LaTeX](https://img.shields.io/badge/LaTeX-008080?style=flat-square&logo=latex&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |

</div>

---

## 🎪 **API Playground**

### 📤 **Upload & Extract**
```http
POST /api/upload
Content-Type: multipart/form-data

🎯 Upload your PDF and get cloud URL instantly
```

### 🤖 **AI Magic Conversion**
```json
POST /api/convert-latex
{
  "extractedData": { /* your resume data */ },
  "jobTitle": "Senior Software Engineer",
  "templateVersion": "v3"
}

💡 Watch AI tailor your content for maximum impact
```

### ✨ **Generate Beautiful PDF**
```json
POST /api/convertJsonTexToPdfLocally
{
  "formattedLatex": "/* LaTeX magic */",
  "email": "you@awesome.dev",
  "name": "Your Name"
}

🎨 Get back a URL to your stunning new CV
```

---

## 🎭 **The Transformation**

<div align="center">

**Before** 😴
```
Generic PDF resume
Plain text format
One-size-fits-all
Hard to customize
```

**After** 🚀
```
✨ AI-optimized content
🎨 Professional LaTeX design
🎯 Job-specific tailoring
☁️ Cloud-ready delivery
```

</div>

---

## 🏁 **Quick Start Adventure**

### 1. **Setup Your Environment**
```bash
# Clone the magic
git clone <your-repo>
cd latex-cv/backend

# Install the arsenal
npm install
```

### 2. **Configure Your Secrets**
```env
MONGO_URI=mongodb://localhost:27017/latex-cv
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_secret_key
GOOGLE_AI_API_KEY=your_ai_key
PORT=5000
```

### 3. **Launch the Rocket**
```bash
npm run dev
# 🚀 Server launches at http://localhost:5000
```

---

## 🛡️ **Security & Performance**

- **🔒 Secure**: File validation, sanitized LaTeX, protected endpoints
- **⚡ Fast**: Stream processing, async operations, smart caching
- **🔄 Reliable**: Error recovery, retry logic, comprehensive logging
- **📈 Scalable**: Cloud-native architecture, optimized for growth

---

## 🎯 **Perfect For**

- 💼 **Job Seekers**: Stand out from the crowd
- 👨‍💻 **Developers**: Technical resumes that impress
- 🎓 **Students**: Academic CVs that get noticed
- 🚀 **Entrepreneurs**: Professional profiles that convert
- 🏢 **HR Teams**: Standardized, beautiful resume processing

---

## 📈 **System Status**

```
🟢 API Status: Running
🟢 AI Service: Active
🟢 PDF Generation: Operational
🟢 Cloud Storage: Connected
```

---

<div align="center">
  <sub>Built with ❤️ by Mandip </sub>
</div>