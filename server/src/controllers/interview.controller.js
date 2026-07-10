const axios = require('axios');
const { Interview } = require('../models/Job');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const generateMockQuestions = (role, difficulty) => {
  const technical = [
    { question: `What is the difference between ${role.includes('Frontend') || role.includes('React') ? 'controlled and uncontrolled components in React?' : 'REST and GraphQL?'}`, type: 'technical', difficulty, sampleAnswer: 'A controlled component has its state managed by React, while uncontrolled components use DOM references.', tips: 'Provide a concrete code example to demonstrate your understanding.' },
    { question: 'Explain the concept of closures in JavaScript.', type: 'technical', difficulty, sampleAnswer: 'A closure is a function that retains access to variables from its outer scope even after the outer function has returned.', tips: 'Walk through a practical example like event handlers or factory functions.' },
    { question: 'How does event delegation work?', type: 'technical', difficulty, sampleAnswer: 'Event delegation uses event bubbling to handle events at a parent element rather than individual children.', tips: 'Mention performance benefits for dynamically added elements.' },
    { question: 'What are promises and async/await?', type: 'technical', difficulty, sampleAnswer: 'Promises represent future values. Async/await is syntactic sugar over promises for cleaner asynchronous code.', tips: 'Show awareness of error handling with try/catch.' },
    { question: 'Explain the difference between SQL and NoSQL databases.', type: 'technical', difficulty, sampleAnswer: 'SQL databases are relational with fixed schemas. NoSQL databases are flexible and scale horizontally.', tips: 'Mention when you would choose one over the other based on use case.' },
  ];
  const behavioral = [
    { question: 'Tell me about a time you faced a challenging technical problem. How did you solve it?', type: 'behavioral', difficulty: 'beginner', sampleAnswer: 'Use the STAR method: Situation, Task, Action, Result.', tips: 'Be specific about your individual contribution vs. team effort.' },
    { question: 'Describe a situation where you had to work under pressure with tight deadlines.', type: 'behavioral', difficulty: 'intermediate', sampleAnswer: 'Focus on time management strategies, prioritization, and communication.', tips: 'Show resilience and learning from the experience.' },
    { question: 'How do you handle disagreements with teammates or managers?', type: 'behavioral', difficulty: 'intermediate', sampleAnswer: 'Emphasize active listening, data-driven arguments, and finding common ground.', tips: 'Avoid speaking negatively about past colleagues.' },
  ];
  const hr = [
    { question: 'Why are you interested in this position?', type: 'hr', difficulty: 'beginner', sampleAnswer: 'Connect your skills and career goals to the specific role and company mission.', tips: 'Research the company beforehand and mention specific aspects that appeal to you.' },
    { question: 'Where do you see yourself in 5 years?', type: 'hr', difficulty: 'beginner', sampleAnswer: 'Align your growth goals with the company\'s trajectory while showing ambition.', tips: 'Be honest but frame goals that make sense within this role.' },
    { question: 'What is your greatest strength and weakness?', type: 'hr', difficulty: 'beginner', sampleAnswer: 'For strength: pick something directly relevant. For weakness: show self-awareness and how you\'re improving.', tips: 'Avoid clichés like "I work too hard" — be authentic.' },
  ];
  const project = [
    { question: 'Walk me through your most impactful project.', type: 'project', difficulty: 'intermediate', sampleAnswer: 'Describe the problem, your approach, technologies used, challenges overcome, and measurable results.', tips: 'Have metrics ready: users, performance improvements, revenue impact.' },
    { question: 'What was the biggest technical challenge in your recent project and how did you overcome it?', type: 'project', difficulty: 'intermediate', sampleAnswer: 'Be specific about the challenge, the solutions you considered, and why you chose your approach.', tips: 'Highlight your problem-solving process, not just the outcome.' },
  ];
  return [...technical.slice(0, 3), ...behavioral.slice(0, 2), ...hr.slice(0, 2), ...project.slice(0, 2)];
};

exports.generateInterviewQuestions = async (req, res) => {
  try {
    const { jobRole = 'Software Engineer', difficulty = 'intermediate', resumeId } = req.body;
    let questions;
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/interview`, { jobRole, difficulty, resumeId }, { timeout: 30000 });
      questions = response.data.questions;
    } catch {
      questions = generateMockQuestions(jobRole, difficulty);
    }

    const interview = await Interview.create({
      userId: req.user._id,
      resumeId,
      jobRole,
      difficulty,
      questions,
    });

    res.status(201).json({ success: true, interview, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort('-createdAt').limit(10);
    res.json({ success: true, interviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
