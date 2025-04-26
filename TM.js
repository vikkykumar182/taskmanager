// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const celebration = document.getElementById('celebration');
const celebrationSound = document.getElementById('celebrationSound');

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" onchange="toggleCompleted(${index})" ${task.completed ? 'checked' : ''}>
      <span>${task.text}</span>
      <button class="deleteBtn" onclick="deleteTask(${index})">Delete</button>
    `;
    if (task.completed) {
      li.classList.add('completed');
    }
    taskList.appendChild(li);
  });
  checkAllTasksCompleted();
}

// Add a new task
addTaskBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    renderTasks();
  }
});

// Toggle task completion
function toggleCompleted(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Delete a task
function deleteTask(index) {
  const li = taskList.children[index];
  li.classList.add('deleting');
  setTimeout(() => {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }, 500);
}

// Check if all tasks are completed
function checkAllTasksCompleted() {
  if (tasks.length > 0 && tasks.every(task => task.completed)) {
    celebration.classList.remove('hidden');
    celebrationSound.play();
    startConfetti();
  } else {
    celebration.classList.add('hidden');
  }
}

// Confetti Animation
// Confetti Animation
function startConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const confettiPieces = [];
    const colors = ['#ff6f61', '#ffcc00', '#00ccff', '#ff00cc', '#00ffcc'];
  
    class Confetti {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 10 + 5;
        this.speed = Math.random() * 3 + 2;
        this.angle = Math.random() * 360;
      }
  
      update() {
        this.y += this.speed;
        this.angle += 5;
        if (this.y > canvas.height) {
          this.y = -this.size;
        }
      }
  
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }
  
    function createConfetti() {
      for (let i = 0; i < 100; i++) {
        confettiPieces.push(new Confetti());
      }
    }
  
    let animationFrameId;
  
    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiPieces.forEach(confetti => {
        confetti.update();
        confetti.draw();
      });
      animationFrameId = requestAnimationFrame(animateConfetti);
    }
  
    createConfetti();
    animateConfetti();
  
    // Stop the confetti animation after 5 seconds
    setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    }, 5000); // 5000 milliseconds = 5 seconds
  }