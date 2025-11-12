document.addEventListener('DOMContentLoaded', function() {
    
    // ---------------------------------------------
    // 1. HERO SLIDESHOW (Crossfade Animation)
    // ---------------------------------------------
    const slides = document.querySelectorAll('.hero-slides .slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = (i === index) ? '1' : '0';
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    if (slides.length > 0) {
        showSlide(currentSlide);
        setInterval(nextSlide, 5000); // Crossfade every 5 seconds
    }


    // ---------------------------------------------
    // 2. LIVE WEATHER WIDGET (API Placeholder)
    // ---------------------------------------------
    const tempElement = document.querySelector('.current-temp');
    const conditionElement = document.querySelector('.condition');
    const backgroundElement = document.querySelector('.weather-background');

    // TO DO: Replace 'YOUR_WEATHER_API_KEY' with your actual key
    const API_KEY = 'YOUR_WEATHER_API_KEY'; 
    const CITY = 'Dedza,MW'; 
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

    function updateWeatherUI(temp, condition) {
        tempElement.textContent = `${Math.round(temp)}°C`;
        conditionElement.textContent = condition;

        // Map condition to your local image files in /images
        let bgImage = '/images/weather-sunny.jpg'; 
        const conditionLower = condition.toLowerCase();

        if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
            bgImage = '/images/weather-rain.jpg';
        } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
            bgImage = '/images/weather-clouds.jpg';
        } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
            bgImage = '/images/weather-mist.jpg';
        }

        backgroundElement.style.backgroundImage = `url('${bgImage}')`;
    }

    async function fetchWeather() {
        if (API_KEY === 'YOUR_WEATHER_API_KEY') {
            console.warn('Weather API key not set. Using default display.');
            updateWeatherUI(20, "Mostly Sunny");
            return;
        }
        
        try {
            const response = await fetch(WEATHER_URL);
            const data = await response.json();

            if (data.main && data.weather) {
                const temp = data.main.temp;
                // Capitalize first letter of condition description
                const description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
                updateWeatherUI(temp, description);
            } else {
                console.error('Failed to retrieve weather data.');
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    }

    fetchWeather(); // Fetch weather on page load


    // ---------------------------------------------
    // 3. TESTIMONIAL CAROUSEL (Auto-Slide)
    // ---------------------------------------------
    const testimonialContainer = document.querySelector('.testimonial-carousel');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    let currentTestimonial = 0;
    
    // Duplicate the first slide to the end for a seamless loop transition
    if (testimonialSlides.length > 1) {
        const firstClone = testimonialSlides[0].cloneNode(true);
        testimonialContainer.appendChild(firstClone);
    }

    // Function to calculate slide width dynamically
    function getSlideWidth() {
        return testimonialSlides.length > 0 ? testimonialSlides[0].offsetWidth : 0;
    }

    function slideTestimonials() {
        const slideWidth = getSlideWidth();
        currentTestimonial++;
        
        // Apply transformation
        testimonialContainer.style.transform = `translateX(${-currentTestimonial * slideWidth}px)`;

        // Check if we hit the cloned slide
        if (currentTestimonial >= testimonialSlides.length) {
            // Instant transition back to the first slide
            setTimeout(() => {
                testimonialContainer.style.transition = 'none';
                currentTestimonial = 0;
                testimonialContainer.style.transform = `translateX(0)`;
            }, 600); // Matches the CSS transition duration
            
            // Re-enable transition for the next slide
            setTimeout(() => {
                testimonialContainer.style.transition = 'transform 0.6s ease-in-out';
            }, 700);
        }
    }
    
    // Start auto-sliding if there are slides
    if (testimonialSlides.length > 1) {
        setInterval(slideTestimonials, 6000); // Change every 6 seconds
    }


    // ---------------------------------------------
    // 4. HAMBURGER MENU TOGGLE (Mobile)
    // ---------------------------------------------
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.main-nav');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        document.body.classList.toggle('no-scroll'); // Optional: prevent background scrolling
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            document.body.classList.remove('no-scroll');
        });
    });
});
                       
