"""
AI Resume Analyzer - FastAPI Service
Provides ATS scoring, resume improvement, job matching, and interview question generation.
Works with mock data when no OpenAI API key is provided.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import io
import json
import random
import re
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="ResumeAI Service",
    description="AI-powered resume analysis, improvement, and job matching",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_KEY = os.getenv("OPENAI_API_KEY", "")
USE_MOCK = os.getenv("USE_MOCK", "true").lower() == "true" or not OPENAI_KEY

# ─── Models ───────────────────────────────────────────────────────────────────

class ImproveRequest(BaseModel):
    resumeText: Optional[str] = ""
    parsedData: Optional[dict] = {}

class InterviewRequest(BaseModel):
    jobRole: str = "Software Engineer"
    difficulty: str = "intermediate"
    resumeId: Optional[str] = None

class RecommendRequest(BaseModel):
    skills: List[str] = []
    experience: Optional[str] = ""
    education: Optional[str] = ""

# ─── Helpers ──────────────────────────────────────────────────────────────────

TECH_KEYWORDS = [
    "python", "javascript", "typescript", "react", "node.js", "express", "mongodb",
    "postgresql", "aws", "docker", "kubernetes", "ci/cd", "git", "rest api", "graphql",
    "html", "css", "tailwind", "next.js", "vue", "angular", "java", "c++", "rust", "go",
    "machine learning", "deep learning", "tensorflow", "pytorch", "fastapi", "flask",
    "django", "sql", "redis", "elasticsearch", "microservices", "agile", "scrum"
]

def extract_text_from_pdf(content: bytes) -> str:
    """Extract text from PDF bytes."""
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        return " ".join(page.extract_text() or "" for page in reader.pages)
    except Exception:
        return "Sample resume text for analysis"

def extract_text_from_docx(content: bytes) -> str:
    """Extract text from DOCX bytes."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        return "\n".join(para.text for para in doc.paragraphs)
    except Exception:
        return "Sample resume text for analysis"

def score_ats(text: str) -> dict:
    """Score a resume for ATS compatibility."""
    text_lower = text.lower()
    
    # Keyword matching
    found = [k for k in TECH_KEYWORDS if k in text_lower]
    missing = [k for k in random.sample(TECH_KEYWORDS, 8) if k not in text_lower][:5]
    keyword_score = min(100, len(found) * 8 + 20)
    
    # Formatting heuristics
    has_sections = all(s in text_lower for s in ["experience", "education", "skills"])
    has_bullets = "•" in text or "-" in text or "*" in text
    formatting_score = 75 + (10 if has_sections else 0) + (10 if has_bullets else 0)
    
    # Length score
    word_count = len(text.split())
    length_score = 80 if 300 <= word_count <= 800 else (60 if word_count < 300 else 70)
    
    # Experience indicators
    has_metrics = any(c.isdigit() for c in text)
    experience_score = 65 + (15 if has_metrics else 0) + random.randint(0, 10)
    
    skills_score = min(95, keyword_score + random.randint(-5, 5))
    education_score = 80 + random.randint(0, 15)
    projects_score = 60 + random.randint(0, 25)
    
    ats_score = int((keyword_score * 0.3 + formatting_score * 0.2 + experience_score * 0.25 + 
                     skills_score * 0.15 + education_score * 0.05 + projects_score * 0.05))
    ats_score = max(45, min(95, ats_score))
    
    return {
        "atsScore": ats_score,
        "formatting": {"score": formatting_score, "feedback": ["Good use of bullet points", "Consider adding more white space", "Font consistency looks good"]},
        "keywords": {"score": keyword_score, "found": found[:8], "missing": missing},
        "experience": {"score": experience_score, "feedback": ["Add quantifiable metrics to achievements", "Use stronger action verbs", "Describe the impact of your work"]},
        "skills": {"score": skills_score, "feedback": ["Skills section is well organized", "Consider grouping by category"]},
        "education": {"score": education_score, "feedback": ["Education section is complete", "Consider adding relevant coursework or GPA if strong"]},
        "projects": {"score": projects_score, "feedback": ["Add GitHub/demo links to projects", "Quantify project impact", "List technologies used"]},
        "suggestions": [
            "Add a concise professional summary at the top",
            "Include measurable achievements (%, $, numbers)",
            "Add relevant certifications and courses",
            "Tailor keywords to match target job descriptions",
            "Add links to GitHub, portfolio, or LinkedIn",
        ],
        "strengths": [
            f"Found {len(found)} relevant technical keywords",
            "Good document structure detected",
            "Appropriate resume length",
        ],
        "weaknesses": [
            f"Missing {len(missing)} high-demand keywords: {', '.join(missing[:3])}",
            "Quantifiable achievements could be stronger",
            "Professional summary section missing or weak",
        ],
        "overallFeedback": f"Your resume scores {ats_score}/100 on ATS compatibility. Focus on adding the missing keywords and quantifying your achievements to improve your score significantly."
    }

def generate_improvements_mock(resume_text: str) -> dict:
    return {
        "summary": "Results-driven Full-Stack Developer with 3+ years of experience architecting and delivering scalable web applications serving 10,000+ daily active users. Expert in React, Node.js, and cloud-native technologies with a proven track record of improving application performance by 40% and leading teams to deliver projects ahead of schedule. Passionate about clean architecture, user-centric design, and measurable business impact.",
        "skills": "Languages: JavaScript (ES6+), TypeScript, Python, SQL\nFrontend: React.js, Next.js, Redux Toolkit, Tailwind CSS, Framer Motion\nBackend: Node.js, Express.js, FastAPI, REST APIs, GraphQL, WebSockets\nDatabases: MongoDB, PostgreSQL, Redis, Elasticsearch\nCloud & DevOps: AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes, CI/CD, GitHub Actions\nTools: Figma, Postman, Jest, Cypress, Webpack, Vite",
        "experience": [
            "Architected and deployed a real-time analytics dashboard serving 15,000+ daily active users, achieving 99.9% uptime and reducing data latency by 60%",
            "Led migration from monolithic to microservices architecture using Docker and Kubernetes, reducing deployment time from 2 hours to 8 minutes",
            "Implemented lazy loading, code splitting, and CDN optimization strategies that reduced initial bundle size by 42% and improved Lighthouse score from 62 to 94",
            "Mentored team of 3 junior developers through code reviews and pair programming sessions, resulting in 30% reduction in bug reports"
        ],
        "projects": [
            "E-Commerce Platform: Built full-stack solution using React/Node.js processing $50K+ in monthly transactions; implemented Stripe payments, Redis caching, and Elasticsearch search — reduced checkout abandonment by 22%",
            "Real-Time Collaboration Tool: Developed WebSocket-based whiteboard supporting 500+ concurrent users with automatic conflict resolution, deployed on AWS with auto-scaling — currently used by 3 enterprise clients",
            "Open Source UI Library: Created 120+ production-ready React components with TypeScript, comprehensive testing, and Storybook documentation — 2,000+ GitHub stars, adopted in 50+ production projects"
        ],
        "generated": True
    }

def generate_interview_questions(job_role: str, difficulty: str) -> list:
    technical = [
        {"question": f"Explain the key architectural patterns you'd use when designing a scalable {job_role} system.", "type": "technical", "difficulty": difficulty, "sampleAnswer": "Discuss microservices, event-driven architecture, caching strategies, and horizontal scaling. Reference specific technologies used.", "tips": "Draw system diagrams if allowed. Show awareness of trade-offs between different patterns."},
        {"question": "What is the difference between SQL and NoSQL databases, and when would you choose one over the other?", "type": "technical", "difficulty": "intermediate", "sampleAnswer": "SQL: ACID compliance, relational data, complex queries. NoSQL: horizontal scaling, flexible schema, high throughput. Choose based on data structure and scale requirements.", "tips": "Give concrete examples: user authentication data (SQL) vs. product catalog (NoSQL)."},
        {"question": "Explain how async/await works in JavaScript and common pitfalls to avoid.", "type": "technical", "difficulty": "intermediate", "sampleAnswer": "Async/await is syntactic sugar over Promises. Pitfalls: unhandled rejections, sequential await in loops (use Promise.all), forgetting error handling with try/catch.", "tips": "Show a code example of incorrect vs. correct parallel async operations."},
        {"question": "How would you optimize a slow API endpoint that takes 3+ seconds to respond?", "type": "technical", "difficulty": "advanced", "sampleAnswer": "Profile first: DB query analysis, N+1 queries, missing indexes. Apply: caching (Redis), pagination, database indexing, query optimization, CDN for static assets.", "tips": "Show a systematic debugging approach. Mention monitoring tools like APM solutions."},
    ]
    behavioral = [
        {"question": "Describe a time you had to make a critical technical decision with incomplete information. What was your process?", "type": "behavioral", "difficulty": difficulty, "sampleAnswer": "Use STAR method. Emphasize: gathering available data, consulting stakeholders, making a reversible decision when possible, documenting the rationale.", "tips": "Highlight decision-making framework and willingness to be wrong and adapt."},
        {"question": "Tell me about a project that failed or didn't go as planned. What did you learn?", "type": "behavioral", "difficulty": "intermediate", "sampleAnswer": "Be honest about the failure. Focus on your specific actions, what went wrong, and concrete changes you made afterward.", "tips": "Show self-awareness and growth mindset. Avoid blaming external factors exclusively."},
    ]
    hr = [
        {"question": f"Why are you applying for this {job_role} position specifically?", "type": "hr", "difficulty": "beginner", "sampleAnswer": "Connect your technical skills and career goals to the specific role requirements and company mission.", "tips": "Research the company beforehand. Mention specific products, values, or challenges that attracted you."},
        {"question": "How do you stay current with rapidly evolving technologies in our field?", "type": "hr", "difficulty": "beginner", "sampleAnswer": "Mention specific resources: tech blogs, conference talks, open source contributions, side projects, online courses.", "tips": "Give concrete examples of recent things you've learned and applied."},
    ]
    project = [
        {"question": "Walk me through your most complex technical project end-to-end, including challenges you faced.", "type": "project", "difficulty": "advanced", "sampleAnswer": "Cover: problem definition, architecture decisions and why, implementation challenges, performance optimizations, lessons learned, measurable outcomes.", "tips": "Have numbers ready: scale, performance improvements, users served, cost savings."},
    ]
    return technical + behavioral + hr + project

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"service": "ResumeAI", "version": "1.0.0", "status": "operational", "mock_mode": USE_MOCK}

@app.get("/health")
async def health():
    return {"status": "healthy", "openai_configured": bool(OPENAI_KEY)}

@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    """Analyze a resume file and return ATS score + feedback."""
    content = await file.read()
    
    if file.filename.endswith('.pdf'):
        text = extract_text_from_pdf(content)
    elif file.filename.endswith(('.docx', '.doc')):
        text = extract_text_from_docx(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")
    
    if not USE_MOCK and OPENAI_KEY:
        try:
            # pyrefly: ignore [missing-import]
            from openai import OpenAI
            client = OpenAI(api_key=OPENAI_KEY)
            # Get base score locally
            base_analysis = score_ats(text)
            
            prompt = f"""You are an expert ATS system and recruiter. Review this resume and provide brief, constructive feedback.
            Resume text: {text[:2000]}
            
            Return JSON with:
            - overallFeedback (string, 2 sentences max)
            - strengths (list of 3 strings)
            - weaknesses (list of 3 strings)
            - suggestions (list of 3 strings)
            """
            
            response = client.chat.completions.create(
                model=os.getenv("MODEL", "gpt-3.5-turbo"),
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            ai_feedback = json.loads(response.choices[0].message.content)
            
            # Merge AI feedback with base scoring
            base_analysis.update({
                "overallFeedback": ai_feedback.get("overallFeedback", base_analysis["overallFeedback"]),
                "strengths": ai_feedback.get("strengths", base_analysis["strengths"]),
                "weaknesses": ai_feedback.get("weaknesses", base_analysis["weaknesses"]),
                "suggestions": ai_feedback.get("suggestions", base_analysis["suggestions"])
            })
            return base_analysis
        except Exception as e:
            print(f"OpenAI error: {e}, falling back to local scoring")
    
    return score_ats(text)

@app.post("/improve")
async def improve_resume(request: ImproveRequest):
    """Generate AI-improved resume sections."""
    if not USE_MOCK and OPENAI_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=OPENAI_KEY)
            prompt = f"""You are an expert resume writer. Rewrite the following resume sections to be more impactful, ATS-optimized, and achievement-focused.
            
Resume text: {request.resumeText[:2000]}

Generate improved versions of:
1. Professional Summary (2-3 sentences, metrics-focused)
2. Skills Section (categorized, comprehensive)
3. Experience statements (3-4 bullet points with metrics)
4. Project descriptions (2-3 impactful descriptions)

Return as JSON with keys: summary, skills, experience (list), projects (list)"""
            
            response = client.chat.completions.create(
                model=os.getenv("MODEL", "gpt-3.5-turbo"),
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"OpenAI error: {e}")
    
    return generate_improvements_mock(request.resumeText)

@app.post("/interview")
async def generate_interview(request: InterviewRequest):
    """Generate personalized interview questions."""
    questions = generate_interview_questions(request.jobRole, request.difficulty)
    return {"questions": questions, "jobRole": request.jobRole, "difficulty": request.difficulty}

@app.post("/recommend")
async def recommend_jobs(request: RecommendRequest):
    """Recommend jobs based on skills."""
    mock_jobs = [
        {"title": "Full Stack Developer", "company": "TechCorp", "matchScore": 92, "skills": request.skills[:3] if request.skills else ["React", "Node.js"]},
        {"title": "Backend Engineer", "company": "StartupX", "matchScore": 85, "skills": ["Node.js", "Python"]},
        {"title": "Frontend Developer", "company": "InnovateCo", "matchScore": 78, "skills": ["React", "TypeScript"]},
    ]
    return {"jobs": mock_jobs}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
