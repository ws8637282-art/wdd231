const courses = [
  { code: 'WDD 130', title: 'Web Fundamentals', credits: 3, category: 'WDD', completed: true },
  { code: 'WDD 131', title: 'Intro to Web Design', credits: 2, category: 'WDD', completed: true },
  { code: 'WDD 230', title: 'Web Frontend Development I', credits: 3, category: 'WDD', completed: false },
  { code: 'WDD 231', title: 'Web Frontend Development II', credits: 3, category: 'WDD', completed: false },
  { code: 'CSE 110', title: 'Introduction to Programming', credits: 3, category: 'CSE', completed: true },
  { code: 'CSE 111', title: 'Programming with Functions', credits: 3, category: 'CSE', completed: false },
  { code: 'CSE 121', title: 'Computer Science Foundations', credits: 3, category: 'CSE', completed: false }
];

const courseList = document.getElementById('course-list');
const totalCreditsElement = document.getElementById('total-credits');
const filterButtons = document.querySelectorAll('.filter-btn');
let activeFilter = 'all';

function renderCourses(filter = 'all') {
  const filteredCourses = filter === 'all'
    ? courses
    : courses.filter((course) => course.category === filter);

  courseList.innerHTML = filteredCourses
    .map(
      (course) => `
        <article class="course-card ${course.completed ? 'completed' : ''}">
          <div class="course-header">
            <p class="course-code">${course.code}</p>
            <span class="course-credits">${course.credits} credits</span>
          </div>
          <h3 class="course-title">${course.title}</h3>
          <span class="course-status">${course.completed ? 'Completed' : 'In Progress'}</span>
        </article>
      `
    )
    .join('');

  const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
  totalCreditsElement.textContent = `Total credits displayed: ${totalCredits}`;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((btn) => {
      btn.classList.toggle('active', btn === button);
    });

    renderCourses(activeFilter);
  });
});

renderCourses(activeFilter);
