import { useState, useEffect, useMemo } from 'react';
import Admin, { AdminTrigger } from './Admin.jsx';
import './Dashboard.css';

const STORAGE_KEY = 'edupulse_lms_state_v1';

const INITIAL_COURSES = [
  {
    id: 'c1',
    title: 'Full-Stack Web Development with React & Node',
    instructor: 'Prof. Ananya Deshmukh',
    category: 'Development',
    level: 'Intermediate',
    duration: '14h 30m',
    enrolled: true,
    gradient: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
    description:
      'Build scalable REST APIs, modern React interfaces, authentication flows, and deploy production-ready full-stack web apps.',
    lessons: [
      {
        id: 'c1-l1',
        title: 'Modern React Architecture & State Flow',
        duration: '18:40',
        summary:
          'Understand component composition, lifting state up, derived state, and avoiding redundant re-renders in large applications.',
        points: [
          'Keep state minimal and derive computed values via useMemo when needed.',
          'Colocate state close to the components that consume it.',
          'Use clean unidirectional data flow to simplify debugging.'
        ]
      },
      {
        id: 'c1-l2',
        title: 'REST API Design & Express Middleware',
        duration: '24:15',
        summary:
          'Structure modular controllers, validation layers, centralized error handling, and JWT-based authentication middleware.',
        points: [
          'Follow consistent HTTP status codes and resource naming.',
          'Validate request payloads before reaching database queries.',
          'Separate route definitions from business logic.'
        ]
      },
      {
        id: 'c1-l3',
        title: 'Database Modeling & Query Optimization',
        duration: '21:10',
        summary:
          'Design normalized relational schemas, add composite indexes, and prevent N+1 query bottlenecks.',
        points: [
          'Index columns frequently used in WHERE, JOIN, and ORDER BY clauses.',
          'Use transactions for multi-step financial or inventory updates.',
          'Profile slow queries with EXPLAIN ANALYZE.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which HTTP status code best indicates a newly created resource?',
        options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
        answer: 1
      },
      {
        id: 'q2',
        question: 'Why should derived values be computed during render instead of stored in separate state?',
        options: [
          'It prevents state synchronization bugs and extra renders',
          'React forbids more than two useState hooks',
          'Derived values cannot be strings',
          'It automatically caches data on the server'
        ],
        answer: 0
      }
    ]
  },
  {
    id: 'c2',
    title: 'Data Structures & Algorithms Masterclass',
    instructor: 'Dr. Vikram Kulkarni',
    category: 'Computer Science',
    level: 'Core CS',
    duration: '22h 15m',
    enrolled: true,
    gradient: 'linear-gradient(135deg, #059669, #0d9488)',
    description:
      'Master arrays, sliding window, trees, graphs, dynamic programming, and time-space complexity analysis for technical interviews.',
    lessons: [
      {
        id: 'c2-l1',
        title: 'Asymptotic Analysis & Big-O Patterns',
        duration: '16:20',
        summary:
          'Break down worst-case vs. amortized complexity across nested loops, divide-and-conquer recurrences, and hash tables.',
        points: [
          'Drop constant factors and lower-order terms in Big-O.',
          'Recognize O(n log n) sorting and binary search boundaries.',
          'Trade space for time using hash maps and prefix sums.'
        ]
      },
      {
        id: 'c2-l2',
        title: 'Graph Traversals: BFS vs. DFS',
        duration: '27:05',
        summary:
          'Implement adjacency lists, shortest path in unweighted graphs using BFS, and cycle detection using DFS.',
        points: [
          'Use a queue for Breadth-First Search and shortest unweighted paths.',
          'Track visited nodes to avoid infinite loops in cyclic graphs.',
          'DFS recursion stack space is O(V) in the worst case.'
        ]
      },
      {
        id: 'c2-l3',
        title: 'Dynamic Programming: Memoization to Tabulation',
        duration: '31:50',
        summary:
          'Identify overlapping subproblems and optimal substructure to turn exponential recursion into polynomial solutions.',
        points: [
          'Start by defining the recurrence relation and base cases clearly.',
          'Memoize top-down first, then convert to bottom-up tabulation.',
          'Optimize space when the current row only depends on the previous row.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which traversal finds the shortest path in an unweighted graph?',
        options: ['Depth-First Search', 'Breadth-First Search', 'Inorder Traversal', 'Topological Sort'],
        answer: 1
      },
      {
        id: 'q2',
        question: 'What is the average time complexity of hash table lookup?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        answer: 0
      }
    ]
  },
  {
    id: 'c3',
    title: 'Database Management Systems & SQL',
    instructor: 'Prof. Meera Nair',
    category: 'Data',
    level: 'Beginner',
    duration: '11h 45m',
    enrolled: true,
    gradient: 'linear-gradient(135deg, #d97706, #ea580c)',
    description:
      'Learn ER modeling, normalization up to BCNF, ACID transactions, indexing internals, and complex analytical SQL queries.',
    lessons: [
      {
        id: 'c3-l1',
        title: 'Normalization: 1NF, 2NF, 3NF & BCNF',
        duration: '19:30',
        summary:
          'Eliminate insertion, update, and deletion anomalies by decomposing tables using functional dependencies.',
        points: [
          '1NF requires atomic column values with no repeating groups.',
          '2NF removes partial dependencies on composite primary keys.',
          '3NF removes transitive dependencies between non-key attributes.'
        ]
      },
      {
        id: 'c3-l2',
        title: 'ACID Properties & Isolation Levels',
        duration: '23:10',
        summary:
          'Explore dirty reads, non-repeatable reads, phantom reads, and how PostgreSQL handles MVCC concurrency.',
        points: [
          'Atomicity guarantees all-or-nothing transaction execution.',
          'Read Committed prevents dirty reads while keeping high throughput.',
          'Serializable provides the strictest isolation guarantees.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which ACID property ensures committed data survives a power failure?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        answer: 3
      }
    ]
  },
  {
    id: 'c4',
    title: 'Cloud Infrastructure & Docker Essentials',
    instructor: 'Rohan Iyer',
    category: 'DevOps',
    level: 'Intermediate',
    duration: '9h 20m',
    enrolled: false,
    gradient: 'linear-gradient(135deg, #7c3aed, #db2777)',
    description:
      'Containerize services with multi-stage Dockerfiles, orchestrate local stacks with Compose, and deploy reliably to the cloud.',
    lessons: [
      {
        id: 'c4-l1',
        title: 'Docker Images, Containers & Layers',
        duration: '15:45',
        summary:
          'Understand union filesystems, build cache optimization, and keeping production images lean with Alpine and multi-stage builds.',
        points: [
          'Order Dockerfile instructions from least to most frequently changed.',
          'Use .dockerignore to exclude node_modules and local secrets.',
          'Run containers as a non-root user in production.'
        ]
      },
      {
        id: 'c4-l2',
        title: 'CI/CD Pipelines & Zero-Downtime Deploys',
        duration: '20:15',
        summary:
          'Automate linting, unit tests, container builds, and health-checked rollouts on every push to main.',
        points: [
          'Fail fast by running lint and unit tests before building images.',
          'Expose /health endpoints for automated readiness checks.',
          'Tag images with immutable commit SHAs instead of only latest.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Why are multi-stage Docker builds used in production?',
        options: [
          'To shrink final image size by excluding build-time tools',
          'To run multiple operating systems inside one process',
          'To bypass port mapping rules',
          'To disable caching completely'
        ],
        answer: 0
      }
    ]
  }
];

const INITIAL_ASSIGNMENTS = [
  {
    id: 'a1',
    title: 'Build a JWT Auth REST API',
    courseId: 'c1',
    courseTitle: 'Full-Stack Web Development with React & Node',
    dueDate: 'Nov 24, 2026',
    status: 'Pending',
    submission: ''
  },
  {
    id: 'a2',
    title: 'Graph Shortest Path Problem Set',
    courseId: 'c2',
    courseTitle: 'Data Structures & Algorithms Masterclass',
    dueDate: 'Nov 27, 2026',
    status: 'Pending',
    submission: ''
  },
  {
    id: 'a3',
    title: 'University Schema Normalization (BCNF)',
    courseId: 'c3',
    courseTitle: 'Database Management Systems & SQL',
    dueDate: 'Nov 15, 2026',
    status: 'Graded (94/100)',
    submission: 'https://github.com/student/dbms-bcnf-lab'
  }
];

const INITIAL_STATE = {
  courses: INITIAL_COURSES,
  completedLessons: ['c1-l1', 'c2-l1', 'c3-l1'],
  notes: {
    'c1-l1': 'Key takeaway: derive filtered lists with useMemo instead of duplicating state.'
  },
  quizScores: {
    c3: { score: 1, total: 1 }
  },
  assignments: INITIAL_ASSIGNMENTS
};

/* Inline SVG Icons (Zero external dependencies) */
function Icon({ name, size = 18 }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  switch (name) {
    case 'dashboard':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'courses':
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'assignments':
      return (
        <svg {...props}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case 'search':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...props}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...props}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case 'play':
      return (
        <svg {...props} fill="currentColor">
          <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...props}>
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      );
    case 'back':
      return (
        <svg {...props}>
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Dashboard({ userName }) {
  const [lms, setLms] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'courses' | 'player' | 'assignments'
  const [role, setRole] = useState('Student'); // 'Student' | 'Instructor'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeCourseId, setActiveCourseId] = useState('c1');
  const [activeLessonId, setActiveLessonId] = useState('c1-l1');
  const [playerTab, setPlayerTab] = useState('overview'); // 'overview' | 'notes' | 'quiz'
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
  const [submitModalItem, setSubmitModalItem] = useState(null);
  const [submissionLink, setSubmissionLink] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lms));
    } catch {
      // Ignore storage quota errors
    }
  }, [lms]);

  const getCourseProgress = (course) => {
    if (!course.lessons.length) return 0;
    const done = course.lessons.filter((l) => lms.completedLessons.includes(l.id)).length;
    return Math.round((done / course.lessons.length) * 100);
  };

  const enrolledCourses = useMemo(
    () => lms.courses.filter((c) => c.enrolled),
    [lms.courses]
  );

  const filteredCourses = useMemo(() => {
    return lms.courses.filter((course) => {
      const matchesCategory =
        categoryFilter === 'All' ||
        (categoryFilter === 'Enrolled' && course.enrolled) ||
        course.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [lms.courses, categoryFilter, searchQuery]);

  const stats = useMemo(() => {
    const totalLessons = enrolledCourses.reduce((acc, c) => acc + c.lessons.length, 0);
    const doneLessons = enrolledCourses.reduce(
      (acc, c) => acc + c.lessons.filter((l) => lms.completedLessons.includes(l.id)).length,
      0
    );
    const avgProgress = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;
    const pendingAssignments = lms.assignments.filter((a) => a.status === 'Pending').length;
    const quizzesPassed = Object.keys(lms.quizScores).length;

    return {
      enrolledCount: enrolledCourses.length,
      doneLessons,
      totalLessons,
      avgProgress,
      pendingAssignments,
      quizzesPassed
    };
  }, [enrolledCourses, lms.completedLessons, lms.assignments, lms.quizScores]);

  const activeCourse = lms.courses.find((c) => c.id === activeCourseId) || lms.courses[0];
  const activeLesson =
    activeCourse?.lessons.find((l) => l.id === activeLessonId) || activeCourse?.lessons[0];

  const openCoursePlayer = (course) => {
    setLms((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => (c.id === course.id ? { ...c, enrolled: true } : c))
    }));
    setActiveCourseId(course.id);
    const firstIncomplete =
      course.lessons.find((l) => !lms.completedLessons.includes(l.id)) || course.lessons[0];
    setActiveLessonId(firstIncomplete?.id || '');
    setPlayerTab('overview');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setActiveView('player');
    setSidebarOpen(false);
  };

  const toggleLessonComplete = (lessonId) => {
    setLms((prev) => {
      const exists = prev.completedLessons.includes(lessonId);
      return {
        ...prev,
        completedLessons: exists
          ? prev.completedLessons.filter((id) => id !== lessonId)
          : [...prev.completedLessons, lessonId]
      };
    });
  };

  const handleNoteChange = (lessonId, value) => {
    setLms((prev) => ({
      ...prev,
      notes: { ...prev.notes, [lessonId]: value }
    }));
  };

  const handleQuizSubmit = () => {
    if (!activeCourse?.quiz?.length) return;
    let score = 0;
    activeCourse.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.answer) score += 1;
    });
    setQuizSubmitted(true);
    setLms((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [activeCourse.id]: { score, total: activeCourse.quiz.length }
      }
    }));
  };

  const handleCourseCreated = (course) => {
    setLms((prev) => ({ ...prev, courses: [course, ...prev.courses] }));
    setActiveView('courses');
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    if (!submitModalItem || !submissionLink.trim()) return;
    setLms((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a.id === submitModalItem.id
          ? { ...a, status: 'Submitted', submission: submissionLink.trim() }
          : a
      )
    }));
    setSubmissionLink('');
    setSubmitModalItem(null);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLms(INITIAL_STATE);
    setActiveView('dashboard');
  };

  const categories = ['All', 'Enrolled', 'Development', 'Computer Science', 'Data', 'DevOps'];

  return (
    <Admin onCourseCreated={handleCourseCreated}>
      <div className="lms-shell">
      {/* Mobile Sidebar Backdrop */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">EP</div>
          <div>
            <div className="brand-title">EduPulse</div>
            <span className="brand-sub">Learning Management</span>
          </div>
        </div>

        <nav className="nav-list">
          <button
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveView('dashboard');
              setSidebarOpen(false);
            }}
          >
            <Icon name="dashboard" />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${
              activeView === 'courses' || activeView === 'player' ? 'active' : ''
            }`}
            onClick={() => {
              setActiveView('courses');
              setSidebarOpen(false);
            }}
          >
            <Icon name="courses" />
            <span>Courses</span>
            <span className="nav-badge">{lms.courses.length}</span>
          </button>

          <button
            className={`nav-item ${activeView === 'assignments' ? 'active' : ''}`}
            onClick={() => {
              setActiveView('assignments');
              setSidebarOpen(false);
            }}
          >
            <Icon name="assignments" />
            <span>Assignments</span>
            {stats.pendingAssignments > 0 && (
              <span className="nav-badge">{stats.pendingAssignments}</span>
            )}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="streak-card">
            <strong>6-Day Study Streak</strong>
            <span>
              {stats.doneLessons}/{stats.totalLessons} lessons completed
            </span>
          </div>
          <button className="reset-btn" onClick={resetDemoData}>
            Reset Demo Progress
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="main-wrapper">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <Icon name="menu" />
            </button>

            <div className="search-box">
              <Icon name="search" size={16} />
              <input
                type="text"
                placeholder="Search courses, topics, or instructors..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'courses') setActiveView('courses');
                }}
              />
            </div>
          </div>

          <div className="topbar-right">
            <div className="role-toggle">
              {['Student', 'Instructor'].map((r) => (
                <button
                  key={r}
                  className={role === r ? 'active' : ''}
                  onClick={() => setRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            {role === 'Instructor' && (
              <AdminTrigger label="New Course" />
            )}

            <div className="notif-wrapper">
              <button
                className="icon-btn"
                onClick={() => setShowNotifs((prev) => !prev)}
                aria-label="Notifications"
              >
                <Icon name="bell" />
                <span className="notif-dot" />
              </button>

              {showNotifs && (
                <div className="notif-dropdown">
                  <h4>Notifications</h4>
                  <div className="notif-item">
                    <strong>Assignment Due Soon</strong>
                    <div>Build a JWT Auth REST API is due Nov 24.</div>
                    <small>2 hours ago</small>
                  </div>
                  <div className="notif-item">
                    <strong>Grade Posted</strong>
                    <div>University Schema Normalization scored 94/100.</div>
                    <small>Yesterday</small>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-pill">
              <div className="avatar">{userName.slice(0, 2).toUpperCase()}</div>
              <span>{userName}</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="content-area">
          {/* ================= DASHBOARD VIEW ================= */}
          {activeView === 'dashboard' && (
            <>
              <div className="page-header">
                <div>
                  <h1>Welcome back, {userName}</h1>
                  <p>Track your active modules, upcoming deadlines, and quiz performance.</p>
                </div>
                <AdminTrigger label="Create Course" />
              </div>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Enrolled Courses</span>
                    <span className="badge badge-indigo">Active</span>
                  </div>
                  <div className="stat-value">{stats.enrolledCount}</div>
                  <div className="stat-sub">Across {lms.courses.length} catalog courses</div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Overall Completion</span>
                    <span className="badge badge-success">{stats.avgProgress}%</span>
                  </div>
                  <div className="stat-value">
                    {stats.doneLessons}/{stats.totalLessons}
                  </div>
                  <div className="stat-sub">Lessons finished</div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Pending Deadlines</span>
                    <span className="badge badge-warning">Action</span>
                  </div>
                  <div className="stat-value">{stats.pendingAssignments}</div>
                  <div className="stat-sub">Assignments awaiting upload</div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Quizzes Attempted</span>
                    <span className="badge badge-indigo">Graded</span>
                  </div>
                  <div className="stat-value">{stats.quizzesPassed}</div>
                  <div className="stat-sub">Instant feedback enabled</div>
                </div>
              </section>

              <div className="dashboard-grid">
                {/* Continue Learning */}
                <section className="panel">
                  <div className="panel-header">
                    <h2>Continue Learning</h2>
                    <button className="text-link" onClick={() => setActiveView('courses')}>
                      View all courses
                    </button>
                  </div>

                  <div className="continue-list">
                    {enrolledCourses.map((course) => {
                      const pct = getCourseProgress(course);
                      return (
                        <div key={course.id} className="continue-item">
                          <div className="continue-info">
                            <h3>{course.title}</h3>
                            <p>
                              {course.instructor} &bull; {course.lessons.length} lessons &bull;{' '}
                              {pct}% complete
                            </p>
                            <div className="progress-track">
                              <div className="progress-fill" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <button
                            className="btn-primary"
                            onClick={() => openCoursePlayer(course)}
                          >
                            Resume
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Upcoming Deadlines */}
                <section className="panel">
                  <div className="panel-header">
                    <h2>Upcoming Deadlines</h2>
                    <button className="text-link" onClick={() => setActiveView('assignments')}>
                      All tasks
                    </button>
                  </div>

                  <div className="deadline-list">
                    {lms.assignments.map((item) => (
                      <div key={item.id} className="deadline-item">
                        <div>
                          <h4>{item.title}</h4>
                          <p>Due {item.dueDate}</p>
                        </div>
                        <span
                          className={`badge ${
                            item.status === 'Pending'
                              ? 'badge-warning'
                              : item.status === 'Submitted'
                              ? 'badge-indigo'
                              : 'badge-success'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {/* ================= COURSES CATALOG VIEW ================= */}
          {activeView === 'courses' && (
            <>
              <div className="page-header">
                <div>
                  <h1>Course Catalog</h1>
                  <p>Browse enrolled modules or start a new track at your own pace.</p>
                </div>
                <AdminTrigger label="Add Course" />
              </div>

              <div className="filter-bar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-chip ${categoryFilter === cat ? 'active' : ''}`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="courses-grid">
                {filteredCourses.map((course) => {
                  const pct = getCourseProgress(course);
                  return (
                    <article key={course.id} className="course-card">
                      <div className="course-banner" style={{ background: course.gradient }}>
                        <div className="course-banner-meta">
                          <span className="course-level">{course.category}</span>
                          <span className="course-level">{course.level}</span>
                        </div>
                      </div>

                      <div className="course-body">
                        <h3 className="course-title">{course.title}</h3>
                        <div className="course-instructor">{course.instructor}</div>
                        <p className="course-desc">{course.description}</p>

                        <div className="progress-block">
                          <div className="progress-label">
                            <span>{course.enrolled ? 'Progress' : 'Not enrolled'}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>

                        <div className="course-actions">
                          <span className="course-stats">
                            {course.lessons.length} lessons &bull; {course.duration}
                          </span>
                          <button
                            className="btn-primary"
                            onClick={() => openCoursePlayer(course)}
                          >
                            {course.enrolled ? 'Open Course' : 'Enroll Now'}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {/* ================= COURSE PLAYER VIEW ================= */}
          {activeView === 'player' && activeCourse && activeLesson && (
            <>
              <div className="page-header">
                <div>
                  <button
                    className="btn-secondary"
                    style={{ marginBottom: 12 }}
                    onClick={() => setActiveView('courses')}
                  >
                    <Icon name="back" size={16} />
                    <span>Back to Courses</span>
                  </button>
                  <h1>{activeCourse.title}</h1>
                  <p>
                    {activeCourse.instructor} &bull; {getCourseProgress(activeCourse)}% completed
                  </p>
                </div>
              </div>

              <div className="player-layout">
                <section className="lesson-stage">
                  {/* Simulated Video Player */}
                  <div className="video-placeholder">
                    <button
                      className="play-circle"
                      onClick={() => toggleLessonComplete(activeLesson.id)}
                      title="Toggle lesson completion"
                    >
                      <Icon name="play" size={26} />
                    </button>
                    <h3>{activeLesson.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
                      Duration: {activeLesson.duration} &bull; Interactive Lesson Module
                    </p>
                  </div>

                  <div className="lesson-content-box">
                    <div className="lesson-header-row">
                      <h2>{activeLesson.title}</h2>
                      <button
                        className={
                          lms.completedLessons.includes(activeLesson.id)
                            ? 'btn-success'
                            : 'btn-primary'
                        }
                        onClick={() => toggleLessonComplete(activeLesson.id)}
                      >
                        {lms.completedLessons.includes(activeLesson.id)
                          ? '✓ Completed'
                          : 'Mark as Complete'}
                      </button>
                    </div>

                    <div className="tabs-bar">
                      {[
                        { id: 'overview', label: 'Lesson Overview' },
                        { id: 'notes', label: 'My Notes' },
                        { id: 'quiz', label: `Quiz (${activeCourse.quiz.length})` }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          className={`tab-btn ${playerTab === tab.id ? 'active' : ''}`}
                          onClick={() => setPlayerTab(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {playerTab === 'overview' && (
                      <div>
                        <p className="lesson-summary">{activeLesson.summary}</p>
                        <ul className="key-points">
                          {activeLesson.points.map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {playerTab === 'notes' && (
                      <div>
                        <textarea
                          className="notes-textarea"
                          placeholder="Write your notes for this lesson... (auto-saved locally)"
                          value={lms.notes[activeLesson.id] || ''}
                          onChange={(e) => handleNoteChange(activeLesson.id, e.target.value)}
                        />
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                          Notes are saved automatically to your browser.
                        </p>
                      </div>
                    )}

                    {playerTab === 'quiz' && (
                      <div className="quiz-box">
                        {quizSubmitted && lms.quizScores[activeCourse.id] && (
                          <div className="quiz-score-banner">
                            <div>
                              <strong>
                                Score: {lms.quizScores[activeCourse.id].score} /{' '}
                                {lms.quizScores[activeCourse.id].total}
                              </strong>
                              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                Review highlighted answers below or retake anytime.
                              </p>
                            </div>
                            <button
                              className="btn-secondary"
                              onClick={() => {
                                setQuizAnswers({});
                                setQuizSubmitted(false);
                              }}
                            >
                              Retake Quiz
                            </button>
                          </div>
                        )}

                        {activeCourse.quiz.map((q, qIndex) => (
                          <div key={q.id} className="quiz-question">
                            <h4>
                              {qIndex + 1}. {q.question}
                            </h4>
                            <div className="quiz-options">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = quizAnswers[q.id] === optIdx;
                                let cls = 'quiz-option';
                                if (quizSubmitted) {
                                  if (optIdx === q.answer) cls += ' correct';
                                  else if (isSelected) cls += ' wrong';
                                } else if (isSelected) {
                                  cls += ' selected';
                                }
                                return (
                                  <button
                                    key={optIdx}
                                    className={cls}
                                    disabled={quizSubmitted}
                                    onClick={() =>
                                      setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                    }
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        {!quizSubmitted && (
                          <div>
                            <button className="btn-primary" onClick={handleQuizSubmit}>
                              Submit Quiz Answers
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                {/* Syllabus Sidebar */}
                <aside className="syllabus-panel">
                  <div className="panel-header" style={{ marginBottom: 10 }}>
                    <h2>Course Syllabus</h2>
                    <span className="badge badge-indigo">
                      {getCourseProgress(activeCourse)}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${getCourseProgress(activeCourse)}%` }}
                    />
                  </div>

                  <div className="syllabus-list">
                    {activeCourse.lessons.map((lesson, idx) => {
                      const isDone = lms.completedLessons.includes(lesson.id);
                      const isCurrent = lesson.id === activeLesson.id;
                      return (
                        <button
                          key={lesson.id}
                          className={`syllabus-item ${isCurrent ? 'active' : ''}`}
                          onClick={() => setActiveLessonId(lesson.id)}
                        >
                          <span className={`lesson-check ${isDone ? 'done' : ''}`}>
                            {isDone ? '✓' : idx + 1}
                          </span>
                          <div className="syllabus-meta">
                            <strong>{lesson.title}</strong>
                            <span>{lesson.duration}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </>
          )}

          {/* ================= ASSIGNMENTS VIEW ================= */}
          {activeView === 'assignments' && (
            <>
              <div className="page-header">
                <div>
                  <h1>Assignments & Submissions</h1>
                  <p>Upload repository links or project deliverables before their due dates.</p>
                </div>
              </div>

              <section className="panel">
                <div className="table-wrap">
                  <table className="lms-table">
                    <thead>
                      <tr>
                        <th>Assignment</th>
                        <th>Course</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lms.assignments.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.title}</strong>
                            {item.submission && (
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                Link: {item.submission}
                              </div>
                            )}
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{item.courseTitle}</td>
                          <td>{item.dueDate}</td>
                          <td>
                            <span
                              className={`badge ${
                                item.status === 'Pending'
                                  ? 'badge-warning'
                                  : item.status === 'Submitted'
                                  ? 'badge-indigo'
                                  : 'badge-success'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td>
                            {item.status === 'Pending' ? (
                              <button
                                className="btn-primary"
                                onClick={() => {
                                  setSubmitModalItem(item);
                                  setSubmissionLink('');
                                }}
                              >
                                Submit
                              </button>
                            ) : (
                              <button
                                className="btn-secondary"
                                onClick={() => {
                                  setSubmitModalItem(item);
                                  setSubmissionLink(item.submission);
                                }}
                              >
                                Update
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {/* ================= SUBMIT ASSIGNMENT MODAL ================= */}
      {submitModalItem && (
        <div className="modal-backdrop" onClick={() => setSubmitModalItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submit Assignment</h2>
              <button className="btn-secondary" onClick={() => setSubmitModalItem(null)}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              {submitModalItem.title}
            </p>

            <form onSubmit={handleAssignmentSubmit}>
              <div className="form-group">
                <label>GitHub Repo / Google Drive URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/project"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSubmitModalItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </Admin>
  );
}