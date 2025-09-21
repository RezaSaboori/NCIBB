// NCIBB Main JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Initialize animations
  initAnimations()

  // Initialize form handling
  initFormHandling()

  // Initialize smooth scrolling
  initSmoothScrolling()

  // Initialize navbar scroll effect
  initNavbarScrollEffect()
})

// Animation initialization
function initAnimations() {
  // Add fade-in animation to elements
  const animatedElements = document.querySelectorAll(
    ".card, .hero-section, .contact-item"
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in")
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  )

  animatedElements.forEach((el) => {
    observer.observe(el)
  })
}

// Form handling
function initFormHandling() {
  const contactForm = document.querySelector("form")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Get form data
      const formData = new FormData(contactForm)
      const data = Object.fromEntries(formData)

      // Simple validation
      if (
        !data.firstName ||
        !data.lastName ||
        !data.email ||
        !data.subject ||
        !data.message
      ) {
        showAlert("Please fill in all required fields.", "danger")
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        showAlert("Please enter a valid email address.", "danger")
        return
      }

      // Simulate form submission
      showAlert(
        "Thank you for your message! We will get back to you soon.",
        "success"
      )
      contactForm.reset()
    })
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Navbar scroll effect
function initNavbarScrollEffect() {
  const navbar = document.querySelector(".navbar")

  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.classList.add("navbar-scrolled")
      } else {
        navbar.classList.remove("navbar-scrolled")
      }
    })
  }
}

// Show alert function
function showAlert(message, type = "info") {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll(".alert")
  existingAlerts.forEach((alert) => alert.remove())

  // Create new alert
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`
  alertDiv.style.cssText =
    "top: 100px; right: 20px; z-index: 9999; min-width: 300px;"

  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  document.body.appendChild(alertDiv)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove()
    }
  }, 5000)
}

// Utility function to debounce events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Add loading state to buttons
function addLoadingState(button) {
  const originalText = button.innerHTML
  button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...'
  button.disabled = true

  return function removeLoadingState() {
    button.innerHTML = originalText
    button.disabled = false
  }
}

// Initialize tooltips if Bootstrap is available
if (typeof bootstrap !== "undefined") {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  )
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
}

// Initialize popovers if Bootstrap is available
if (typeof bootstrap !== "undefined") {
  const popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  )
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
  })
}
