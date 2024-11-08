// Generate bubbles dynamically and append them to the background
document.addEventListener('DOMContentLoaded', () => {
    const bubbleContainer = document.getElementById('bubbles-background');
  
    function createBubble() {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
  
      // Randomize the horizontal position of the bubble
      bubble.style.left = `${Math.random() * 100}vw`;
      bubble.style.animationDelay = `${Math.random() * 5}s`;
  
      bubbleContainer.appendChild(bubble);
  
      // Remove the bubble after it finishes its animation
      bubble.addEventListener('animationend', () => {
        bubble.remove();
      });
    }
  
    // Generate multiple bubbles
    setInterval(createBubble, 500); // Create a bubble every 500ms
  });
  