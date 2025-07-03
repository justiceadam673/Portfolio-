import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState("");

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);

    const handleScroll = () => {
      const sections = [
        "hero",
        "about",
        "skills",
        "projects",
        "experience",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (
          element &&
          scrollPosition >= element.offsetTop &&
          scrollPosition < element.offsetTop + element.offsetHeight
        ) {
          setActiveSection(section);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("sending");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactForm),
        }
      );

      if (response.ok) {
        setSubmitStatus("success");
        setContactForm({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    }

    setTimeout(() => setSubmitStatus(""), 3000);
  };

  const skills = [
    { name: "JavaScript", level: 95 },
    { name: "React", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "Python", level: 80 },
    { name: "MongoDB", level: 75 },
    { name: "FastAPI", level: 85 },
    { name: "TypeScript", level: 80 },
    { name: "Next.js", level: 85 },
  ];

  const projects = [
    {
      id: 1,
      title: "Smart Farm Market System",
      description:
        "A comprehensive smart farming marketplace platform connecting farmers with buyers, featuring real-time market data, inventory management, and automated trading systems.",
      tech: ["React", "Node.js", "MongoDB", "Express", "Socket.io"],
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=300&fit=crop",
      liveUrl: "https://fwan.vercel.app",
      codeUrl: "#",
    },
    {
      id: 2,
      title: "E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
      tech: ["React", "FastAPI", "PostgreSQL", "Stripe"],
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
      liveUrl: "#",
      codeUrl: "#",
    },
    {
      id: 3,
      title: "Task Management App",
      description:
        "Collaborative task management application with real-time updates, team collaboration, and progress tracking.",
      tech: ["Vue.js", "Express", "MongoDB", "Socket.io"],
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
      liveUrl: "#",
      codeUrl: "#",
    },
  ];

  const experience = [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Solutions Inc.",
      period: "2022 - Present",
      description:
        "Led development of multiple web applications, mentored junior developers, and implemented best practices for code quality and performance.",
    },
    {
      title: "Frontend Developer",
      company: "Digital Agency",
      period: "2020 - 2022",
      description:
        "Developed responsive web applications using React and modern frontend technologies, collaborated with design teams to create pixel-perfect implementations.",
    },
    {
      title: "Junior Developer",
      company: "StartupCorp",
      period: "2019 - 2020",
      description:
        "Built and maintained web applications, gained experience in full-stack development, and contributed to agile development processes.",
    },
  ];

  if (isLoading) {
    return (
      <div className='loading-screen'>
        <div className='loading-content'>
          <div className='loading-spinner'></div>
          <h2 className='loading-text'>Loading Portfolio...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className='App'>
      {/* Navigation */}
      <nav className='navbar'>
        <div className='nav-container'>
          <div className='nav-logo'>
            <span className='logo-text'>DevPortfolio</span>
          </div>
          <ul className='nav-menu'>
            <li>
              <a
                href='#hero'
                className={activeSection === "hero" ? "active" : ""}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href='#about'
                className={activeSection === "about" ? "active" : ""}
              >
                About
              </a>
            </li>
            <li>
              <a
                href='#skills'
                className={activeSection === "skills" ? "active" : ""}
              >
                Skills
              </a>
            </li>
            <li>
              <a
                href='#projects'
                className={activeSection === "projects" ? "active" : ""}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href='#experience'
                className={activeSection === "experience" ? "active" : ""}
              >
                Experience
              </a>
            </li>
            <li>
              <a
                href='#contact'
                className={activeSection === "contact" ? "active" : ""}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id='hero' className='hero-section'>
        <div className='hero-bg'></div>
        <div className='hero-content'>
          <h1 className='hero-title'>
            <span className='hero-greeting'>Hello, I'm</span>
            <span className='hero-name'>Alex Johnson</span>
            <span className='hero-role'>Full Stack Developer</span>
          </h1>
          <p className='hero-description'>
            Passionate about creating innovative web solutions that bridge
            technology and user experience. Specializing in modern JavaScript
            frameworks and scalable backend systems.
          </p>
          <div className='hero-buttons'>
            <a href='#projects' className='btn btn-primary'>
              View My Work
            </a>
            <a href='#contact' className='btn btn-secondary'>
              Get In Touch
            </a>
          </div>
        </div>
        <div className='hero-scroll'>
          <span>Scroll Down</span>
          <div className='scroll-arrow'></div>
        </div>
      </section>

      {/* About Section */}
      <section id='about' className='about-section'>
        <div className='container'>
          <h2 className='section-title'>About Me</h2>
          <div className='about-content'>
            <div className='about-text'>
              <p>
                I'm a passionate full-stack developer with over 4 years of
                experience creating digital solutions that make a difference. My
                journey in software development started with a curiosity about
                how things work, which evolved into a love for building
                applications that solve real-world problems.
              </p>
              <p>
                I specialize in modern web technologies including React,
                Node.js, and Python, with a strong focus on creating scalable,
                maintainable, and user-friendly applications. My recent project,
                the Smart Farm Market System, demonstrates my ability to tackle
                complex problems in emerging technology sectors.
              </p>
              <div className='about-highlights'>
                <div className='highlight'>
                  <h3>50+</h3>
                  <p>Projects Completed</p>
                </div>
                <div className='highlight'>
                  <h3>4+</h3>
                  <p>Years Experience</p>
                </div>
                <div className='highlight'>
                  <h3>25+</h3>
                  <p>Happy Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id='skills' className='skills-section'>
        <div className='container'>
          <h2 className='section-title'>Technical Skills</h2>
          <div className='skills-grid'>
            {skills.map((skill, index) => (
              <div
                key={index}
                className='skill-card'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className='skill-info'>
                  <span className='skill-name'>{skill.name}</span>
                  <span className='skill-percentage'>{skill.level}%</span>
                </div>
                <div className='skill-bar'>
                  <div
                    className='skill-fill'
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id='projects' className='projects-section'>
        <div className='container'>
          <h2 className='section-title'>Featured Projects</h2>
          <div className='projects-grid'>
            {projects.map((project, index) => (
              <div
                key={project.id}
                className='project-card'
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className='project-image'>
                  <img src={project.image} alt={project.title} />
                  <div className='project-overlay'>
                    <div className='project-links'>
                      <a
                        href={project.liveUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='project-link'
                      >
                        Live Demo
                      </a>
                      <a
                        href={project.codeUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='project-link'
                      >
                        View Code
                      </a>
                    </div>
                  </div>
                </div>
                <div className='project-content'>
                  <h3 className='project-title'>{project.title}</h3>
                  <p className='project-description'>{project.description}</p>
                  <div className='project-tech'>
                    {project.tech.map((tech, i) => (
                      <span key={i} className='tech-tag'>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id='experience' className='experience-section'>
        <div className='container'>
          <h2 className='section-title'>Work Experience</h2>
          <div className='timeline'>
            {experience.map((exp, index) => (
              <div
                key={index}
                className='timeline-item'
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className='timeline-dot'></div>
                <div className='timeline-content'>
                  <h3 className='exp-title'>{exp.title}</h3>
                  <h4 className='exp-company'>{exp.company}</h4>
                  <span className='exp-period'>{exp.period}</span>
                  <p className='exp-description'>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='contact-section'>
        <div className='container'>
          <h2 className='section-title'>Let's Work Together</h2>
          <div className='contact-content'>
            <div className='contact-info'>
              <h3>Get In Touch</h3>
              <p>
                I'm always open to discussing new opportunities, interesting
                projects, or potential collaborations. Let's create something
                amazing together!
              </p>
              <div className='contact-methods'>
                <div className='contact-method'>
                  <strong>Email:</strong> justiceadam673@email.com
                </div>
                <div className='contact-method'>
                  <strong>Phone:</strong> +234 901 828 1266
                </div>
                <div className='contact-method'>
                  <strong>Location:</strong> Plateau State, Nigeria
                </div>
              </div>
            </div>
            <form onSubmit={handleContactSubmit} className='contact-form'>
              <div className='form-group'>
                <input
                  type='text'
                  placeholder='Your Name'
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <input
                  type='email'
                  placeholder='Your Email'
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className='form-group'>
                <textarea
                  placeholder='Your Message'
                  rows='5'
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  required
                ></textarea>
              </div>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={submitStatus === "sending"}
              >
                {submitStatus === "sending" ? "Sending..." : "Send Message"}
              </button>
              {submitStatus === "success" && (
                <p className='success-message'>Message sent successfully!</p>
              )}
              {submitStatus === "error" && (
                <p className='error-message'>
                  Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='footer'>
        <div className='container'>
          <p>&copy; 2025 Alex Johnson. All rights reserved.</p>
          <div className='social-links'>
            <a href='#' target='_blank' rel='noopener noreferrer'>
              LinkedIn
            </a>
            <a href='#' target='_blank' rel='noopener noreferrer'>
              GitHub
            </a>
            <a href='#' target='_blank' rel='noopener noreferrer'>
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
