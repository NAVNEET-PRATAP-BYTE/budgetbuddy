const typewriter = document.querySelector('.typewriter');
const textArray = ["WELCOME!!"];
let textIndex = 0;
let charIndex = 0;

function typeEffect() {
    if (charIndex < textArray[textIndex].length) {
        typewriter.textContent += textArray[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 200);
    } else {
        setTimeout(() => {
            typewriter.textContent = "";
            charIndex = 0;
            textIndex = (textIndex + 1) % textArray.length;
            typeEffect();
        }, 1000);
    }
}
typeEffect();

const carouselItems = document.querySelectorAll('.carousel-item');
let currentIndex = 0;

function showNextSlide() {
    carouselItems[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % carouselItems.length;
    carouselItems[currentIndex].classList.add('active');
}

setInterval(showNextSlide, 3000);

// Load Lottie animation for the left side
const moneyAnimationLeft = document.getElementById('money-animation-left');
lottie.loadAnimation({
    container: moneyAnimationLeft, // The container element
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'MoneyRain.json' // URL to the raining money animation
});

// Load Lottie animation for the right side
const moneyAnimationRight = document.getElementById('money-animation-right');
lottie.loadAnimation({
    container: moneyAnimationRight, // The container element
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'MoneyRain.json' // URL to the raining money animation
});
