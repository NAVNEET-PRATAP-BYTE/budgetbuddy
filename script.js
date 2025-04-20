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