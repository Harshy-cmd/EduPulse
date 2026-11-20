import { createContext, useContext, useState } from 'react';
import './Admin.css';

const AdminContext = createContext(null);

const INITIAL_COURSE_FORM = {
  title: '',
  instructor: 'You (Instructor)',
  category: 'Development',
  level: 'Beginner',
  duration: '6h 00m',
  description: '',
  firstLessonTitle: ''
};

export function AdminTrigger({ label }) {
  const context = useContext(AdminContext);
  if (!context) throw new Error('AdminTrigger must be rendered inside Admin.');

  return (
    <button className="btn-primary" onClick={context.openCourseModal}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span>{label}</span>
    </button>
  );
}

export default function Admin({ children, onCourseCreated }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState(INITIAL_COURSE_FORM);
  const contextValue = {
    openCourseModal: () => setShowCreateModal(true)
  };

  const handleCreateCourse = (event) => {
    event.preventDefault();
    if (!newCourse.title.trim()) return;

    const id = `c-${Date.now()}`;
    const created = {
      id,
      title: newCourse.title.trim(),
      instructor: newCourse.instructor.trim() || 'You (Instructor)',
      category: newCourse.category,
      level: newCourse.level,
      duration: newCourse.duration || '6h 00m',
      enrolled: true,
      gradient: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      description:
        newCourse.description.trim() ||
        'Custom course created directly inside EduPulse LMS.',
      lessons: [
        {
          id: `${id}-l1`,
          title: newCourse.firstLessonTitle.trim() || 'Module 1: Course Introduction & Setup',
          duration: '12:00',
          summary:
            'Welcome to your newly created course! Add notes, track progress, and expand lessons as needed.',
          points: [
            'Review course objectives and milestones.',
            'Set up your local workspace and reference links.'
          ]
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: `Ready to complete ${newCourse.title.trim()}?`,
          options: ['Yes, let us get started!', 'Need a quick review first'],
          answer: 0
        }
      ]
    };

    onCourseCreated(created);
    setNewCourse(INITIAL_COURSE_FORM);
    setShowCreateModal(false);
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Course</h2>
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label>Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Operating Systems & Concurrency"
                  value={newCourse.title}
                  onChange={(event) => setNewCourse({ ...newCourse, title: event.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Instructor Name</label>
                <input
                  type="text"
                  value={newCourse.instructor}
                  onChange={(event) =>
                    setNewCourse({ ...newCourse, instructor: event.target.value })
                  }
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(event) =>
                      setNewCourse({ ...newCourse, category: event.target.value })
                    }
                  >
                    <option value="Development">Development</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Data">Data</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={newCourse.level}
                    onChange={(event) => setNewCourse({ ...newCourse, level: event.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Core CS">Core CS</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>First Lesson Title</label>
                <input
                  type="text"
                  placeholder="e.g., Processes, Threads & Scheduling"
                  value={newCourse.firstLessonTitle}
                  onChange={(event) =>
                    setNewCourse({ ...newCourse, firstLessonTitle: event.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Briefly describe what students will learn..."
                  value={newCourse.description}
                  onChange={(event) =>
                    setNewCourse({ ...newCourse, description: event.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
}
