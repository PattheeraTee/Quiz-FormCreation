const { GoogleGenerativeAI } = require("@google/generative-ai");
const quizService = require('../services/quizService');

// ตั้งค่า Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your_api_key_here');

exports.generateQuizQuestions = async (req, res) => {
    try {
        const { topic, numQuestions, userId, type, coverPage, sectionId, sectionTitle, sectionDescription, language } = req.body;

        // ปรับ prompt เพื่อสร้างคำถามหลายข้อพร้อมกัน รวมถึงการสร้าง quizTitle และ description
        const prompt = `
          Create ${numQuestions} multiple choice quiz questions about ${topic}, where each question has 4 options, and one of the options is correct.
          Also, generate a quizTitle and a description for the quiz based on the given topic.
          The language of the questions, options, quizTitle, and description should be ${language}.
          The questions and options should be returned in this JSON schema:
          {
            "quizTitle": "string",
            "description": "string",
            "questions": [
              {
                "question": {
                  "text": "string",
                  "required": "boolean",
                  "options": [
                    {
                      "text": "string",
                      "isCorrect": "boolean"
                    }
                  ]
                }
              }
            ]
          }
        `;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generation_config: { "response_mime_type": "application/json" }
        });

        const result = await model.generateContent(prompt);
        const candidates = result.response?.candidates;

        if (candidates && candidates.length > 0) {
            let rawContent = candidates[0].content?.parts[0]?.text;
            rawContent = rawContent.replace(/```json|```/g, '').trim();

            const generatedContent = JSON.parse(rawContent);
            const { quizTitle, description, questions: generatedQuestions } = generatedContent;

            // สร้าง quiz JSON structure โดยรวมคำถามจาก Gemini
            const quizData = {
                userId,
                type,
                coverPage: {
                    create: {
                        quizTitle: quizTitle,
                        description: description,
                        buttonText: coverPage?.buttonText || "Start Quiz",
                        imagePath: coverPage?.imagePath,
                    },
                },
                sections: {
                    create: [{
                        sectionId,
                        sectionNumber: 1, // สามารถปรับได้ตามลำดับที่ต้องการ
                        sectionTitle,
                        sectionDescription,
                        questions: {
                            create: generatedQuestions.map((genQuestion, index) => ({
                                questionId: `${index + 1}`,
                                type: "Multiple Choice",
                                text: genQuestion.question.text,
                                required: genQuestion.question.required,
                                points: 1, // คุณสามารถเปลี่ยนตามที่ต้องการ
                                options: {
                                    create: genQuestion.question.options.map((option, optIndex) => ({
                                        optionId: `${optIndex + 1}`,
                                        text: option.text,
                                        isCorrect: option.isCorrect,
                                    })),
                                },
                            })),
                        },
                    }],
                }
            };

            // บันทึก quiz โดยใช้ quizService
            const newQuiz = await quizService.createQuiz(quizData);

            // ส่ง quizId ที่สร้างกลับไปยังผู้ใช้
            res.status(201).json({ quizId: newQuiz.quizId });
        } else {
            res.status(500).json({ message: "No content generated from the API." });
        }
    } catch (error) {
        console.error("Error generating quiz questions:", error);
        res.status(500).json({ message: "Failed to generate quiz questions." });
    }
};
