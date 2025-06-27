import '../css/styles.css';

// Dropdown DOM
const dropdownButton = document.querySelector('button.dropdown');
const dropdownMenu = document.querySelector('.dropdown-menu');

// Carousel DOM
const carouselImages = document.querySelector('.carousel-images'); // container for images
const imageElements = document.querySelectorAll('img');
const imageForwardButton = document.querySelector('.forward-button');
const imageBackwardButton = document.querySelector('.back-button');
const nav = document.querySelector('.nav'); // container for buttons
const navButtons = document.querySelectorAll('.nav button');

// Dropdown

// Toggle dropdown
dropdownButton.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdownMenu.classList.toggle('open');
});

// Close dropdown on blur
document.addEventListener('click', () => {
  const openDropdown = document.querySelector('.dropdown-menu.open');
  if (!openDropdown) {
    return;
  }
  openDropdown.classList.remove('open');
});

// Carousel

let imageIndex = 1;
let isTransitioning = false; // Flag
let intervalId = null; // Need intervalId to stop interval

// Clone images to append to DOM to create infinite loop illusion
const firstImage = imageElements[0].cloneNode(true);
const lastImage = imageElements[imageElements.length - 1].cloneNode(true);

carouselImages.insertBefore(lastImage, imageElements[0]);
carouselImages.appendChild(firstImage);

const images = [firstImage, ...imageElements, lastImage];

carouselImages.addEventListener('transitionend', () => {
  let snapped = null;

  if (imageIndex === 0) {
    // We just transitioned to the cloned last image, so snap to real last image
    snapped = images.length - 2;
  }

  if (imageIndex === images.length - 1) {
    // We just transitioned to the cloned first image, so snap to real first image
    snapped = 1;
  }

  if (snapped !== null) {
    imageIndex = snapped;
    carouselImages.style.transition = 'none'; // Disable transition for instant jump
    carouselImages.style.transform = `translateX(-${imageIndex * 100}%)`;
  }

  isTransitioning = false; // Unlock transitions after everything is done
});

// Forward and backwards buttons to change image sequentially
imageForwardButton.addEventListener('click', () => changeImage(1));
imageBackwardButton.addEventListener('click', () => changeImage(-1));

// Helper function to change image
function changeImage(direction) {
  // Flag check to prevent multiple clicks
  if (isTransitioning) {
    return;
  }
  imageIndex += direction;
  slideCarousel(direction);
  resetInterval();
}

// Changes image
function slideCarousel(direction) {
  isTransitioning = true; // Sets flag to prevent multiple clicks
  const currentlySelected = nav.querySelector('.selected');
  currentlySelected.classList.remove('selected');
  let next;
  if (direction > 0) {
    // Forward
    next = currentlySelected.nextElementSibling || currentlySelected.parentElement.firstElementChild;
  } else if (direction < 0) {
    // Backward
    next = currentlySelected.previousElementSibling || currentlySelected.parentElement.lastElementChild;
  }
  next.classList.add('selected');
  updateCarouselPosition();
}

// Sets "selected" class to clicked button
navButtons.forEach((navButton) =>
  navButton.addEventListener('click', () => {
    selectNavButton(navButton);
  })
);

// Moves image
function selectNavButton(navButton) {
  for (const navButton of navButtons) {
    navButton.classList.remove('selected');
  }
  const buttonIndex = navButton.dataset.index;
  navButton.classList.add('selected');
  imageIndex = Number(buttonIndex);
  updateCarouselPosition();
  resetInterval();
}

// Moves image
function updateCarouselPosition() {
  carouselImages.style.transition = '0.4s ease-in-out';
  carouselImages.style.transform = `translateX(-${imageIndex * 100}%)`;
}

// Document interval to automatically change image
// Start interval on page load
if (document.visibilityState === 'visible') {
  startInterval();
}

// Stops interval if user tabs away
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    startInterval();
  } else {
    stopInterval();
  }
});

//Start
function startInterval() {
  if (!intervalId) {
    intervalId = setInterval(() => {
      imageIndex++;
      slideCarousel(1);
      isTransitioning = false;
    }, 5000);
  }
}

function stopInterval() {
  clearInterval(intervalId);
  intervalId = null; // Resets interval ID, so it can be set and interval to restart again in startInterval()
}

// Reset needed for manual user clicks so automatic interval doesn't interfere
function resetInterval() {
  stopInterval();
  startInterval();
}
