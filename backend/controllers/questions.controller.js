const Question = require("../models/question.model");
const jwt = require("jsonwebtoken");
const { containsBadWords } = require("../utils/badWordsFilter");

class QuestionsController {
  // Check authentication status
  static async checkAuth(req, res) {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.json({ authenticated: false });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ authenticated: true, user: decoded });
    } catch (error) {
      res.json({ authenticated: false });
    }
  }

  // Get FAQ questions (public endpoint)
  static getFAQQuestions(req, res) {
    Question.getFAQQuestions()
      .then((questions) => {
        res.json({
          success: true,
          data: questions,
        });
      })
      .catch((error) => {
        console.error("Error fetching FAQ questions:", error);
        res.status(500).json({
          success: false,
          message: "خطا در دریافت سوالات متداول",
        });
      });
  }

  // Get user's questions
  static getUserQuestions(req, res) {
    try {
      Question.getUserQuestions(req.user.id)
        .then((questions) => {
          res.json({
            success: true,
            data: questions,
          });
        })
        .catch((error) => {
          console.error("Error fetching user questions:", error);
          res.status(500).json({
            success: false,
            message: "خطا در دریافت سوالات کاربر",
          });
        });
    } catch (error) {
      console.error("Error fetching user questions:", error);
      res.status(500).json({
        success: false,
        message: "خطا در دریافت سوالات کاربر",
      });
    }
  }

  // Submit a new question
  static submitQuestion(req, res) {
    try {
      const { question, category = "general", priority = "medium" } = req.body;

      if (!question || question.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "لطفاً سوال خود را وارد کنید",
        });
      }

      if (containsBadWords(question)) {
        return res.status(400).json({
          success: false,
          message:
            "سوال شما حاوی کلمات نامناسب است. لطفاً سوال خود را بدون توهین ارسال کنید.",
        });
      }

      Question.create({
        user_id: req.user.id,
        question: question.trim(),
        category,
        priority,
      })
        .then((result) => {
          res.json({
            success: true,
            message: "سوال شما با موفقیت ارسال شد و در حال بررسی است",
            data: { id: result.id },
          });
        })
        .catch((error) => {
          console.error("Error submitting question:", error);
          res.status(500).json({
            success: false,
            message: "خطا در ارسال سوال",
          });
        });
    } catch (error) {
      console.error("Error submitting question:", error);
      res.status(500).json({
        success: false,
        message: "خطا در ارسال سوال",
      });
    }
  }

  // Get all questions (admin/employee only)
  static getAllQuestions(req, res) {
    try {
      // Check if user is admin or employee
      if (req.user.role !== "admin" && req.user.role !== "employee") {
        return res.status(403).json({
          success: false,
          message:
            "دسترسی غیرمجاز (فقط مدیر یا کارمند می‌تواند این بخش را ببیند)",
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      Question.getAllQuestionsWithPagination(limit, offset)
        .then((result) => {
          res.json({
            success: true,
            data: {
              questions: result.questions,
              totalPages: Math.ceil(result.total / limit),
              currentPage: page,
              totalQuestions: result.total,
            },
          });
        })
        .catch((error) => {
          console.error("Error fetching all questions:", error);
          res.status(500).json({
            success: false,
            message: "خطا در دریافت سوالات",
          });
        });
    } catch (error) {
      console.error("Error fetching all questions:", error);
      res.status(500).json({
        success: false,
        message: "خطا در دریافت سوالات",
      });
    }
  }

  // Get pending questions (admin only)
  static getPendingQuestions(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "دسترسی غیرمجاز",
        });
      }

      Question.getPendingQuestions()
        .then((questions) => {
          res.json({
            success: true,
            data: questions,
          });
        })
        .catch((error) => {
          console.error("Error fetching pending questions:", error);
          res.status(500).json({
            success: false,
            message: "خطا در دریافت سوالات در انتظار",
          });
        });
    } catch (error) {
      console.error("Error fetching pending questions:", error);
      res.status(500).json({
        success: false,
        message: "خطا در دریافت سوالات در انتظار",
      });
    }
  }

  // Reply to a question (admin/employee only)
  static replyToQuestion(req, res) {
    try {
      // Check if user is admin or employee
      if (req.user.role !== "admin" && req.user.role !== "employee") {
        return res.status(403).json({
          success: false,
          message: "دسترسی غیرمجاز",
        });
      }

      const { questionId } = req.params;
      const { answer, is_faq = false, status = "replied" } = req.body;

      if (!answer || answer.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "لطفاً پاسخ را وارد کنید",
        });
      }

      Question.update(questionId, {
        answer: answer.trim(),
        is_replied: true,
        is_faq,
        status,
        replied_by: req.user.id,
      })
        .then((result) => {
          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "سوال یافت نشد",
            });
          }

          res.json({
            success: true,
            message: "پاسخ با موفقیت ثبت شد",
          });
        })
        .catch((error) => {
          console.error("Error replying to question:", error);
          res.status(500).json({
            success: false,
            message: "خطا در ثبت پاسخ",
          });
        });
    } catch (error) {
      console.error("Error replying to question:", error);
      res.status(500).json({
        success: false,
        message: "خطا در ثبت پاسخ",
      });
    }
  }

  // Edit a question (admin/employee only)
  static editQuestion(req, res) {
    try {
      // Check if user is admin or employee
      if (req.user.role !== "admin" && req.user.role !== "employee") {
        return res.status(403).json({
          success: false,
          message: "دسترسی غیرمجاز",
        });
      }

      const { questionId } = req.params;
      const { question } = req.body;

      if (!question || question.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "لطفاً متن سوال را وارد کنید",
        });
      }

      Question.editQuestion(questionId, question.trim())
        .then((result) => {
          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "سوال یافت نشد",
            });
          }

          res.json({
            success: true,
            message: "سوال با موفقیت ویرایش شد",
          });
        })
        .catch((error) => {
          console.error("Error editing question:", error);
          res.status(500).json({
            success: false,
            message: "خطا در ویرایش سوال",
          });
        });
    } catch (error) {
      console.error("Error editing question:", error);
      res.status(500).json({
        success: false,
        message: "خطا در ویرایش سوال",
      });
    }
  }

  // Edit a reply (admin/employee only)
  static editReply(req, res) {
    try {
      // Check if user is admin or employee
      if (req.user.role !== "admin" && req.user.role !== "employee") {
        return res.status(403).json({
          success: false,
          message: "دسترسی غیرمجاز",
        });
      }

      const { questionId } = req.params;
      const { answer } = req.body;

      if (!answer || answer.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "لطفاً متن پاسخ را وارد کنید",
        });
      }

      Question.editReply(questionId, answer.trim())
        .then((result) => {
          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "سوال یافت نشد",
            });
          }

          res.json({
            success: true,
            message: "پاسخ با موفقیت ویرایش شد",
          });
        })
        .catch((error) => {
          console.error("Error editing reply:", error);
          res.status(500).json({
            success: false,
            message: "خطا در ویرایش پاسخ",
          });
        });
    } catch (error) {
      console.error("Error editing reply:", error);
      res.status(500).json({
        success: false,
        message: "خطا در ویرایش پاسخ",
      });
    }
  }

  // Edit user's own question
  static editUserQuestion(req, res) {
    try {
      const { questionId } = req.params;
      const { question } = req.body;

      if (!question || question.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "لطفاً متن سوال را وارد کنید",
        });
      }

      // Check if question belongs to the user
      Question.getById(questionId)
        .then((questionData) => {
          if (!questionData) {
            return res.status(404).json({
              success: false,
              message: "سوال یافت نشد",
            });
          }

          if (questionData.user_id !== req.user.id) {
            return res.status(403).json({
              success: false,
              message: "شما فقط می‌توانید سوالات خود را ویرایش کنید",
            });
          }

          // Check if question has been replied to
          if (questionData.is_replied) {
            return res.status(400).json({
              success: false,
              message: "نمی‌توانید سوالی که پاسخ داده شده را ویرایش کنید",
            });
          }

          return Question.editQuestion(questionId, question.trim());
        })
        .then((result) => {
          if (result && result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "سوال یافت نشد",
            });
          }

          res.json({
            success: true,
            message: "سوال با موفقیت ویرایش شد",
          });
        })
        .catch((error) => {
          console.error("Error editing user question:", error);
          res.status(500).json({
            success: false,
            message: "خطا در ویرایش سوال",
          });
        });
    } catch (error) {
      console.error("Error editing user question:", error);
      res.status(500).json({
        success: false,
        message: "خطا در ویرایش سوال",
      });
    }
  }

  // Delete user's own question
  static deleteUserQuestion(req, res) {
    try {
      const { questionId } = req.params;

      // Check if question belongs to the user
      Question.getById(questionId)
        .then((questionData) => {
          if (!questionData) {
            return res.status(404).json({
              success: false,
              message: "سوال یافت نشد",
            });
          }

          if (questionData.user_id !== req.user.id) {
            return res.status(403).json({
              success: false,
              message: "شما فقط می‌توانید سوالات خود را حذف کنید",
            });
          }

          return Question.delete(questionId);
        })
        .then((result) => {
          if (result && result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "سوال یافت نشد",
            });
          }

          res.json({
            success: true,
            message: "سوال با موفقیت حذف شد",
          });
        })
        .catch((error) => {
          console.error("Error deleting user question:", error);
          res.status(500).json({
            success: false,
            message: "خطا در حذف سوال",
          });
        });
    } catch (error) {
      console.error("Error deleting user question:", error);
      res.status(500).json({
        success: false,
        message: "خطا در حذف سوال",
      });
    }
  }

  // Delete a question (admin/employee only)
  static deleteQuestion(req, res) {
    try {
      // Check if user is admin or employee
      if (req.user.role !== "admin" && req.user.role !== "employee") {
        return res.status(403).json({
          success: false,
          message: "دسترسی غیرمجاز",
        });
      }

      const { questionId } = req.params;
      Question.delete(questionId)
        .then((result) => {
          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "سوال یافت نشد",
            });
          }

          res.json({
            success: true,
            message: "سوال با موفقیت حذف شد",
          });
        })
        .catch((error) => {
          console.error("Error deleting question:", error);
          res.status(500).json({
            success: false,
            message: "خطا در حذف سوال",
          });
        });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({
        success: false,
        message: "خطا در حذف سوال",
      });
    }
  }

  // Search questions
  static searchQuestions(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "لطفاً عبارت جستجو را وارد کنید",
        });
      }

      Question.search(q.trim())
        .then((questions) => {
          res.json({
            success: true,
            data: questions,
          });
        })
        .catch((error) => {
          console.error("Error searching questions:", error);
          res.status(500).json({
            success: false,
            message: "خطا در جستجوی سوالات",
          });
        });
    } catch (error) {
      console.error("Error searching questions:", error);
      res.status(500).json({
        success: false,
        message: "خطا در جستجوی سوالات",
      });
    }
  }

  // Get unanswered questions count (admin/employee)
  static getUnansweredQuestionsCount(req, res) {
    try {
      // Check if user is admin or employee
      if (req.user.role !== "admin" && req.user.role !== "employee") {
        return res.status(403).json({
          success: false,
          message: "دسترسی غیرمجاز",
        });
      }

      Question.getUnansweredQuestionsCount()
        .then((count) => {
          res.json({
            success: true,
            count: count,
          });
        })
        .catch((error) => {
          console.error("Error fetching unanswered questions count:", error);
          res.status(500).json({
            success: false,
            message: "خطا در دریافت تعداد سوالات بی‌پاسخ",
          });
        });
    } catch (error) {
      console.error("Error fetching unanswered questions count:", error);
      res.status(500).json({
        success: false,
        message: "خطا در دریافت تعداد سوالات بی‌پاسخ",
      });
    }
  }

  static getUnseenAnswersToMyQuestions = async (req, res) => {
    try {
      const userId = req.user.id;
      const answers = await Question.getUnseenAnswersToMyQuestions(userId);
      res.json({ success: true, data: answers });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "خطا در دریافت اعلان‌های پاسخ به سوالات" });
    }
  };

  static markAnswerAsSeen = async (req, res) => {
    try {
      const { questionId } = req.body;
      if (!questionId)
        return res.status(400).json({ message: "questionId is required" });
      await Question.markAnswerAsSeen(questionId);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "خطا در بروزرسانی اعلان پاسخ سوال" });
    }
  };
}

module.exports = QuestionsController;
