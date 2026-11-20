import { useMemo, useState } from 'react';
import './InstructorDashboard.css';

const INITIAL_COURSES = [
  { id: 'course-1', title: 'Modern React: From Components to Production', category: 'Development', status: 'Published', students: 42, lessons: 18, lessonTitles: ['Component composition', 'Managing state at scale'] },
  { id: 'course-2', title: 'Practical JavaScript Foundations', category: 'Development', status: 'Published', students: 36, lessons: 14, lessonTitles: ['Working with arrays', 'Asynchronous JavaScript'] },
  { id: 'course-3', title: 'Accessible Interfaces with HTML and CSS', category: 'Design', status: 'Draft', students: 0, lessons: 6, lessonTitles: ['Semantic HTML', 'Keyboard-first interaction'] }
];

const INITIAL_SUBMISSIONS = [
  { id: 'sub-1', student: 'Maya Patel', assignment: 'React State Patterns', course: 'Modern React', submitted: 'Today, 9:12 AM', status: 'Pending', grade: '', feedback: '' },
  { id: 'sub-2', student: 'Leo Chen', assignment: 'JavaScript Array Methods', course: 'JavaScript Foundations', submitted: 'Today, 8:46 AM', status: 'Pending', grade: '', feedback: '' },
  { id: 'sub-3', student: 'Ava Johnson', assignment: 'Component Design Exercise', course: 'Modern React', submitted: 'Yesterday', status: 'Graded', grade: '92', feedback: 'Clear component boundaries and thoughtful naming.' },
  { id: 'sub-4', student: 'Noah Williams', assignment: 'Semantic HTML Audit', course: 'Accessible Interfaces', submitted: 'Yesterday', status: 'Pending', grade: '', feedback: '' },
  { id: 'sub-5', student: 'Isha Rao', assignment: 'Async JavaScript Lab', course: 'JavaScript Foundations', submitted: 'Nov 18', status: 'Graded', grade: '88', feedback: 'Good use of async/await. Add error handling next time.' }
];

const INITIAL_STUDENTS = [
  { id: 'student-1', name: 'Maya Patel', email: 'maya.patel@example.com', course: 'Modern React', progress: 78, status: 'Active' },
  { id: 'student-2', name: 'Leo Chen', email: 'leo.chen@example.com', course: 'JavaScript Foundations', progress: 54, status: 'Active' },
  { id: 'student-3', name: 'Ava Johnson', email: 'ava.johnson@example.com', course: 'Modern React', progress: 91, status: 'Active' },
  { id: 'student-4', name: 'Noah Williams', email: 'noah.williams@example.com', course: 'Accessible Interfaces', progress: 32, status: 'Needs attention' },
  { id: 'student-5', name: 'Isha Rao', email: 'isha.rao@example.com', course: 'JavaScript Foundations', progress: 100, status: 'Completed' }
];

const INITIAL_ANNOUNCEMENTS = [
  { id: 'announcement-1', course: 'Modern React', message: 'The component composition workshop notes are now available in the lesson resources.', time: 'Nov 19, 2026' },
  { id: 'announcement-2', course: 'JavaScript Foundations', message: 'A reminder that the async JavaScript lab is due this Friday.', time: 'Nov 17, 2026' }
];

const NAV_ITEMS = [
  { id: 'Overview', label: 'Overview' },
  { id: 'My Courses', label: 'My Courses' },
  { id: 'Assignments & Grading', label: 'Assignments & Grading' },
  { id: 'Students', label: 'Students' },
  { id: 'Announcements', label: 'Announcements' }
];

function InstructorIcon({ name }) {
  const paths = {
    Overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    'My Courses': <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" /><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20" /></>,
    'Assignments & Grading': <><path d="M9 11l2 2 4-4" /><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8l6 6z" /><path d="M14 3v6h6" /></>,
    Students: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    Announcements: <><path d="M3 11v2a2 2 0 0 0 2 2h2l9 5V5l-9 5H5a2 2 0 0 0-2 2z" /><path d="M11 17l1.5 4" /><path d="M20 9a5 5 0 0 1 0 6" /></>
  };
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function getInitials(name) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
}

export default function InstructorDashboard({ user, onSignOut }) {
  const instructorName = user?.name || 'Instructor';
  const [activeTab, setActiveTab] = useState('Overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [students] = useState(INITIAL_STUDENTS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [studentSearch, setStudentSearch] = useState('');
  const [submissionFilter, setSubmissionFilter] = useState('All');
  const [courseModal, setCourseModal] = useState(null);
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementCourse, setAnnouncementCourse] = useState(INITIAL_COURSES[0].title);
  const [announcementNotice, setAnnouncementNotice] = useState('');

  const pendingCount = submissions.filter((submission) => submission.status === 'Pending').length;
  const enrolledCount = courses.reduce((total, course) => total + course.students, 0);
  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    return students.filter((student) =>
      `${student.name} ${student.email} ${student.course} ${student.status}`.toLowerCase().includes(query)
    );
  }, [studentSearch, students]);
  const filteredSubmissions = submissions.filter((submission) =>
    submissionFilter === 'All' || submission.status === submissionFilter
  );

  const switchTab = (tab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };

  const saveCourse = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (courseModal.mode === 'lesson') {
      const lessonTitle = String(formData.get('lesson') || '').trim();
      if (!lessonTitle) return;
      setCourses((current) => current.map((course) =>
        course.id === courseModal.courseId
          ? { ...course, lessons: course.lessons + 1, lessonTitles: [...course.lessonTitles, lessonTitle] }
          : course
      ));
      setCourseModal(null);
      return;
    }

    const title = String(formData.get('title') || '').trim();
    if (!title) return;

    const category = String(formData.get('category') || 'Development');
    const status = String(formData.get('status') || 'Draft');
    setCourses((current) => [
      ...current,
      { id: `course-${Date.now()}`, title, category, status, students: 0, lessons: 1, lessonTitles: ['Course introduction'] }
    ]);
    setCourseModal(null);
  };

  const updateSubmission = (submissionId, field, value) => {
    setSubmissions((current) => current.map((submission) =>
      submission.id === submissionId ? { ...submission, [field]: value } : submission
    ));
  };

  const saveGrade = (submission) => {
    const grade = Number(submission.grade);
    if (!Number.isFinite(grade) || grade < 0 || grade > 100) return;
    setSubmissions((current) => current.map((item) =>
      item.id === submission.id ? { ...item, grade: String(grade), status: 'Graded' } : item
    ));
  };

  const publishAnnouncement = (event) => {
    event.preventDefault();
    const message = announcementMessage.trim();
    if (!message) return;
    setAnnouncements((current) => [
      { id: `announcement-${Date.now()}`, course: announcementCourse, message, time: new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date()) },
      ...current
    ]);
    setAnnouncementMessage('');
    setAnnouncementNotice('Announcement published.');
    window.setTimeout(() => setAnnouncementNotice(''), 3000);
  };

  return (
    <div className="inst-dash-shell">
      {mobileNavOpen && <button className="inst-dash-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`inst-dash-sidebar${mobileNavOpen ? ' inst-dash-sidebar-open' : ''}`} aria-label="Instructor navigation">
        <div className="inst-dash-brand">
          <div className="inst-dash-logo" aria-hidden="true">EP</div>
          <div>
            <div className="inst-dash-brand-title">EduPulse</div>
            <span className="inst-dash-brand-sub">Learning Management</span>
          </div>
        </div>
        <span className="inst-dash-sidebar-label">Instructor Portal</span>
        <nav className="inst-dash-nav">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`inst-dash-nav-item${activeTab === item.id ? ' inst-dash-nav-active' : ''}`}
              onClick={() => switchTab(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <InstructorIcon name={item.id} />
              <span>{item.label}</span>
              {item.id === 'Assignments & Grading' && pendingCount > 0 && <span className="inst-dash-nav-count">{pendingCount}</span>}
            </button>
          ))}
        </nav>
        <div className="inst-dash-sidebar-footer">
          <div className="inst-dash-sidebar-user">
            <span className="inst-dash-avatar">{getInitials(instructorName)}</span>
            <span className="inst-dash-sidebar-user-copy"><strong>{instructorName}</strong><span>Instructor</span></span>
          </div>
          <button type="button" className="inst-dash-signout inst-dash-signout-side" onClick={onSignOut}>Sign out</button>
        </div>
      </aside>

      <div className="inst-dash-main">
        <header className="inst-dash-topbar">
          <button type="button" className="inst-dash-menu-toggle" aria-label="Open navigation" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((open) => !open)}>
            <span /><span /><span />
          </button>
          <div className="inst-dash-topbar-title">
            <span>Instructor Portal</span>
            <strong>{activeTab}</strong>
          </div>
          <div className="inst-dash-topbar-user">
            <div className="inst-dash-topbar-name"><strong>{instructorName}</strong><span>Instructor</span></div>
            <span className="inst-dash-avatar">{getInitials(instructorName)}</span>
            <button type="button" className="inst-dash-signout" onClick={onSignOut}>Sign out</button>
          </div>
        </header>

        <main className="inst-dash-content">
          {activeTab === 'Overview' && (
            <section className="inst-dash-section" aria-labelledby="inst-dash-overview-title">
              <div className="inst-dash-page-heading">
                <div><h1 id="inst-dash-overview-title">Good to see you, {instructorName.split(' ')[0]}</h1><p>Here is what is happening across your courses.</p></div>
                <button type="button" className="inst-dash-primary" onClick={() => { setActiveTab('My Courses'); setCourseModal({ mode: 'course' }); }}>Create a course</button>
              </div>
              <div className="inst-dash-kpis">
                <article className="inst-dash-kpi"><span>Active courses</span><strong>{courses.filter((course) => course.status === 'Published').length}</strong><small>Published and open to students</small></article>
                <article className="inst-dash-kpi"><span>Enrolled students</span><strong>{enrolledCount}</strong><small>Across your published courses</small></article>
                <article className="inst-dash-kpi"><span>Pending grading</span><strong>{pendingCount}</strong><small>Submissions waiting for review</small></article>
                <article className="inst-dash-kpi"><span>Upcoming sessions</span><strong>3</strong><small>Next session: Thu, 2:00 PM</small></article>
              </div>
              <div className="inst-dash-overview-grid">
                <section className="inst-dash-panel">
                  <div className="inst-dash-panel-heading"><div><h2>Recent activity</h2><p>Updates from your learning space</p></div></div>
                  <div className="inst-dash-activity-list">
                    <article className="inst-dash-activity"><span className="inst-dash-activity-mark">01</span><div><strong>Maya Patel submitted an assignment</strong><p>React State Patterns · Today, 9:12 AM</p></div></article>
                    <article className="inst-dash-activity"><span className="inst-dash-activity-mark">02</span><div><strong>Your course has a new enrollment</strong><p>Modern React · Yesterday</p></div></article>
                    <article className="inst-dash-activity"><span className="inst-dash-activity-mark">03</span><div><strong>Announcement published</strong><p>JavaScript Foundations · Nov 17</p></div></article>
                  </div>
                </section>
                <section className="inst-dash-panel inst-dash-next-panel">
                  <div className="inst-dash-panel-heading"><div><h2>Next up</h2><p>Your upcoming teaching schedule</p></div></div>
                  <div className="inst-dash-session"><span>THU<br /><strong>26</strong></span><div><strong>React patterns workshop</strong><p>Modern React · 2:00 PM</p></div></div>
                  <div className="inst-dash-session"><span>FRI<br /><strong>27</strong></span><div><strong>JavaScript office hours</strong><p>JavaScript Foundations · 11:30 AM</p></div></div>
                </section>
              </div>
            </section>
          )}

          {activeTab === 'My Courses' && (
            <section className="inst-dash-section" aria-labelledby="inst-dash-courses-title">
              <div className="inst-dash-page-heading"><div><h1 id="inst-dash-courses-title">My courses</h1><p>Build and manage your course catalog.</p></div><button type="button" className="inst-dash-primary" onClick={() => setCourseModal({ mode: 'course' })}>Create course</button></div>
              <div className="inst-dash-course-grid">
                {courses.map((course) => (
                  <article className="inst-dash-course-card" key={course.id}>
                    <div className="inst-dash-course-top"><span className="inst-dash-course-category">{course.category}</span><span className={`inst-dash-status${course.status === 'Published' ? ' inst-dash-status-live' : ''}`}>{course.status}</span></div>
                    <h2>{course.title}</h2>
                    <ul className="inst-dash-lesson-list">{course.lessonTitles.slice(-2).map((lesson, index) => <li key={`${course.id}-lesson-${index}`}>{lesson}</li>)}</ul>
                    <div className="inst-dash-course-meta"><span>{course.students} students</span><span>{course.lessons} lessons</span></div>
                    <div className="inst-dash-course-actions">
                      <button type="button" className="inst-dash-secondary" onClick={() => setCourseModal({ mode: 'lesson', courseId: course.id, title: course.title })}>Add lesson</button>
                      <span className="inst-dash-course-status">{course.status}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'Assignments & Grading' && (
            <section className="inst-dash-section" aria-labelledby="inst-dash-grading-title">
              <div className="inst-dash-page-heading"><div><h1 id="inst-dash-grading-title">Assignments &amp; grading</h1><p>Review student work and share clear, useful feedback.</p></div><span className="inst-dash-total-chip">{pendingCount} pending</span></div>
              <div className="inst-dash-filter-row" aria-label="Filter submissions">
                {['All', 'Pending', 'Graded'].map((filter) => <button type="button" key={filter} className={`inst-dash-filter${submissionFilter === filter ? ' inst-dash-filter-active' : ''}`} onClick={() => setSubmissionFilter(filter)}>{filter}</button>)}
              </div>
              <div className="inst-dash-table-wrap">
                <table className="inst-dash-table">
                  <thead><tr><th>Student / assignment</th><th>Course</th><th>Submitted</th><th>Status</th><th>Grade &amp; feedback</th></tr></thead>
                  <tbody>
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id}>
                        <td><strong>{submission.student}</strong><span>{submission.assignment}</span></td>
                        <td>{submission.course}</td>
                        <td>{submission.submitted}</td>
                        <td><span className={`inst-dash-status${submission.status === 'Graded' ? ' inst-dash-status-live' : ''}`}>{submission.status}</span></td>
                        <td className="inst-dash-grade-cell">
                          <div className="inst-dash-grade-fields">
                            <label className="inst-dash-visually-hidden" htmlFor={`grade-${submission.id}`}>Grade for {submission.student}</label>
                            <input id={`grade-${submission.id}`} type="number" min="0" max="100" placeholder="Score" value={submission.grade} onChange={(event) => updateSubmission(submission.id, 'grade', event.target.value)} />
                            <label className="inst-dash-visually-hidden" htmlFor={`feedback-${submission.id}`}>Feedback for {submission.student}</label>
                            <input id={`feedback-${submission.id}`} type="text" placeholder="Feedback" value={submission.feedback} onChange={(event) => updateSubmission(submission.id, 'feedback', event.target.value)} />
                            <button type="button" className="inst-dash-save-grade" onClick={() => saveGrade(submission)}>Save</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredSubmissions.length === 0 && <tr><td className="inst-dash-empty" colSpan="5">No submissions match this filter.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'Students' && (
            <section className="inst-dash-section" aria-labelledby="inst-dash-students-title">
              <div className="inst-dash-page-heading"><div><h1 id="inst-dash-students-title">Students</h1><p>Track progress and find learners across your courses.</p></div><span className="inst-dash-total-chip">{filteredStudents.length} students</span></div>
              <label className="inst-dash-search"><span className="inst-dash-visually-hidden">Search students</span><input type="search" value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} placeholder="Search by name, email, course, or status" /></label>
              <div className="inst-dash-table-wrap">
                <table className="inst-dash-table inst-dash-students-table">
                  <thead><tr><th>Student</th><th>Enrolled course</th><th>Progress</th><th>Status</th></tr></thead>
                  <tbody>{filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td><div className="inst-dash-student-cell"><span className="inst-dash-avatar">{getInitials(student.name)}</span><span><strong>{student.name}</strong><span>{student.email}</span></span></div></td>
                      <td>{student.course}</td>
                      <td><div className="inst-dash-progress-cell"><div className="inst-dash-progress-track"><span style={{ width: `${student.progress}%` }} /></div><span>{student.progress}%</span></div></td>
                      <td><span className={`inst-dash-status${student.status === 'Active' ? ' inst-dash-status-live' : ''}`}>{student.status}</span></td>
                    </tr>
                  ))}{filteredStudents.length === 0 && <tr><td className="inst-dash-empty" colSpan="4">No students found.</td></tr>}</tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'Announcements' && (
            <section className="inst-dash-section" aria-labelledby="inst-dash-announcements-title">
              <div className="inst-dash-page-heading"><div><h1 id="inst-dash-announcements-title">Announcements</h1><p>Share course updates with your students.</p></div></div>
              <form className="inst-dash-panel inst-dash-announcement-form" onSubmit={publishAnnouncement}>
                <h2>Write an announcement</h2>
                <label htmlFor="inst-dash-announcement-course">Course</label>
                <select id="inst-dash-announcement-course" value={announcementCourse} onChange={(event) => setAnnouncementCourse(event.target.value)}>
                  {courses.map((course) => <option key={course.id} value={course.title}>{course.title}</option>)}
                </select>
                <label htmlFor="inst-dash-announcement-message">Message</label>
                <textarea id="inst-dash-announcement-message" rows="4" maxLength="500" value={announcementMessage} onChange={(event) => setAnnouncementMessage(event.target.value)} placeholder="Write an update for your students..." required />
                <div className="inst-dash-announcement-actions"><span>{announcementNotice || `${announcementMessage.length}/500`}</span><button type="submit" className="inst-dash-primary">Publish announcement</button></div>
              </form>
              <div className="inst-dash-announcements-list">
                <h2>Recent announcements</h2>
                {announcements.map((announcement) => (
                  <article className="inst-dash-announcement" key={announcement.id}><div className="inst-dash-announcement-top"><span>{announcement.course}</span><time>{announcement.time}</time></div><p>{announcement.message}</p></article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {courseModal && (
        <div className="inst-dash-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCourseModal(null); }}>
          <section className="inst-dash-modal" role="dialog" aria-modal="true" aria-labelledby="inst-dash-modal-title">
            <div className="inst-dash-modal-heading"><div><h2 id="inst-dash-modal-title">{courseModal.mode === 'lesson' ? 'Add a lesson' : 'Create a course'}</h2>{courseModal.title && <p>{courseModal.title}</p>}</div><button type="button" aria-label="Close dialog" className="inst-dash-modal-close" onClick={() => setCourseModal(null)}>×</button></div>
            <form onSubmit={saveCourse}>
              {courseModal.mode === 'course' ? (
                <>
                  <label htmlFor="inst-dash-course-title">Course title</label>
                  <input id="inst-dash-course-title" name="title" type="text" placeholder="e.g. Product Design Essentials" required autoFocus />
                  <label htmlFor="inst-dash-course-category">Category</label>
                  <select id="inst-dash-course-category" name="category"><option>Development</option><option>Design</option><option>Data</option><option>Business</option></select>
                  <label htmlFor="inst-dash-course-status">Status</label>
                  <select id="inst-dash-course-status" name="status"><option>Draft</option><option>Published</option></select>
                  <div className="inst-dash-modal-actions"><button type="button" className="inst-dash-secondary" onClick={() => setCourseModal(null)}>Cancel</button><button type="submit" className="inst-dash-primary">Create course</button></div>
                </>
              ) : (
                <>
                  <label htmlFor="inst-dash-lesson-title">Lesson title</label>
                  <input id="inst-dash-lesson-title" name="lesson" type="text" placeholder="e.g. Building reusable hooks" required autoFocus />
                  <label htmlFor="inst-dash-lesson-summary">Lesson notes</label>
                  <textarea id="inst-dash-lesson-summary" rows="3" placeholder="A short overview for the lesson" />
                  <div className="inst-dash-modal-actions"><button type="button" className="inst-dash-secondary" onClick={() => setCourseModal(null)}>Cancel</button><button type="submit" className="inst-dash-primary">Add lesson</button></div>
                </>
              )}
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
