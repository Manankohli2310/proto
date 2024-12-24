document.addEventListener('DOMContentLoaded', () => {
    const dragDropArea = document.getElementById('dragDropArea');
    const fileInput = document.getElementById('fileInput');
    const convertButton = document.getElementById('convertButton');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const thankYouSlide = document.getElementById('thankYouSlide');
    const downloadButton = document.getElementById('downloadButton');
    const convertMoreButton = document.getElementById('convertMoreButton');
    let selectedFormat = null;
    let selectedQuality = null;
    let fileToConvert = null;
    let convertedFileURL = null;
  
    // Initially hide loading and thank-you sections
    loadingOverlay.classList.add('hidden');
    thankYouSlide.classList.add('hidden');
  
    // Drag and Drop Area
    dragDropArea.addEventListener('click', () => fileInput.click());
    dragDropArea.addEventListener('dragover', (e) => e.preventDefault());
    dragDropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length) {
        fileToConvert = files[0];
        dragDropArea.innerText = `File Selected: ${files[0].name}`;
      }
    });
  
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length) {
        fileToConvert = files[0];
        dragDropArea.innerText = `File Added Successfully!`;
      }
    });
  
    // Format and Quality Selection
    document.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.format) {
          selectedFormat = btn.dataset.format;
          document.querySelectorAll('.option-btn[data-format]').forEach((b) =>
            b.classList.remove('selected')
          );
        }
        if (btn.dataset.quality) {
          selectedQuality = btn.dataset.quality;
          document.querySelectorAll('.option-btn[data-quality]').forEach((b) =>
            b.classList.remove('selected')
          );
        }
        btn.classList.add('selected');
      });
    });
  
    // Convert Button
    convertButton.addEventListener('click', async () => {
      if (!fileToConvert) {
        alert('Please upload a file first!');
        return;
      }
      if (!selectedFormat || !selectedQuality) {
        alert('Please select both format and quality!');
        return;
      }
  
      // Show loading animation
    //   dragDropArea.classList.add('hidden'); // Hide the drag-drop area
      loadingOverlay.classList.remove('hidden'); // Show loading overlay
  
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Perform the conversion
        const convertedFileBlob = await convertFile(fileToConvert, selectedFormat, selectedQuality);
  
        // Create a download link for the converted file
        convertedFileURL = URL.createObjectURL(convertedFileBlob);
  
        // Hide loading and show thank-you slide
        loadingOverlay.classList.add('hidden');
        thankYouSlide.classList.remove('hidden');
      } catch (error) {
        alert('File conversion failed. Please try again!');
        loadingOverlay.classList.add('hidden');
        dragDropArea.classList.remove('hidden');
      }
    });
  
    // Thank You Slide Buttons
    downloadButton.addEventListener('click', () => {
      if (convertedFileURL) {
        const a = document.createElement('a');
        a.href = convertedFileURL;
        a.download = `Converted file.${selectedFormat}`;
        a.click();
      }
    });
  
    convertMoreButton.addEventListener('click', () => {
      thankYouSlide.classList.add('hidden');
      dragDropArea.classList.remove('hidden'); // Show the drag-drop area again
      dragDropArea.innerText = 'Drag and Drop or Click to Select File';
      convertedFileURL = null;
      fileToConvert = null;
      document.querySelectorAll('.option-btn').forEach((btn) => btn.classList.remove('selected'));
    });
  
    // Function to Convert File
    async function convertFile(file, format, quality) {
      const image = await loadImage(file);
  
      // Create a canvas to process the image
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
  
      // Set canvas size based on quality
      switch (quality) {
        case '1080p':
          canvas.width = 1920;
          canvas.height = (1920 / image.width) * image.height;
          break;
        case '720p':
          canvas.width = 1280;
          canvas.height = (1280 / image.width) * image.height;
          break;
        case '480p':
          canvas.width = 854;
          canvas.height = (854 / image.width) * image.height;
          break;
        default:
          canvas.width = image.width;
          canvas.height = image.height;
      }
  
      // Draw the image onto the canvas
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
  
      // Export the canvas content to the desired format
      const mimeType = getMimeType(format);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, mimeType));
      return blob;
    }
  
    // Helper Functions
    function loadImage(file) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (e) => {
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  
    function getMimeType(format) {
      switch (format) {
        case 'png':
          return 'image/png';
        case 'jpg':
          return 'image/jpeg';
        case 'webp':
          return 'image/webp';
        case 'ico':
          return 'image/x-icon';
        case 'tiff':
          return 'image/tiff';
        default:
          return 'image/png';
      }
    }
  });
// Show Thank You Slide
function showThankYouSlide() {
    document.getElementById('thankYouSlide').classList.remove('hidden');
    document.querySelector('.main-layout').classList.add('hidden');
  }
  
  // Hide Thank You Slide
  function hideThankYouSlide() {
    document.getElementById('thankYouSlide').classList.add('hidden');
    document.querySelector('.main-layout').classList.remove('hidden');
  }
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  
  // Toggle dropdown menu on click
  hamburgerMenu.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
  });
  