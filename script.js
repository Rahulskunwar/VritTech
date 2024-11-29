const trandingSlider = new Swiper('.tranding-slider', {
  direction: 'vertical',
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 0,
    stretch:350, 
    depth: 200,
    modifier: 1, 
    slideShadows: false, 
  }
});