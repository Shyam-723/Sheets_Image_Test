document.addEventListener('DOMContentLoaded', () => {
    const imageDisplayArea = document.getElementById('image-display-area');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');

    // !!! IMPORTANT: Replace this with your actual deployed Google Apps Script URL !!!
    const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbxK6fgsWy_X4JzudhcfV_oXyS7GrY3aTShS2vxZAZlu57IZ-8WR-AjBvhHj4ag0tyKM/exec';

    // Function to display an error message
    function displayError(message) {
        loadingMessage.classList.add('hidden'); // Hide loading
        errorMessage.textContent = `Error: ${message}`;
        errorMessage.classList.remove('hidden'); // Show error
    }

    // Fetch data from Google Apps Script
    fetch(googleAppsScriptUrl)
        .then(response => {
            // Check if the network response was successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse the JSON response
        })
        .then(images => {
            console.log('Fetched image data:', images); // Keep this for debugging

            loadingMessage.classList.add('hidden'); // Hide loading message

            // Check if the Apps Script returned an error property
            if (images.error) {
                displayError(images.error);
                return;
            }

            // Check if no images were returned
            if (images.length === 0) {
                imageDisplayArea.innerHTML = '<p class="text-gray-600 text-center text-xl">No images found in the Google Sheet. Please add data.</p>';
                return;
            }

            // Iterate through the array of image data and create elements
            images.forEach(image => {
                const cardDiv = document.createElement('div');
                // Apply Tailwind classes directly here, as @apply is not processed in external CSS
                // NOT IMPORTANT THIS IS JUST CUSTOMIZING
                cardDiv.classList.add(
                    'bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden',
                    'transition-transform', 'duration-300', 'ease-in-out', 'hover:scale-105',
                    'w-full' // Keep w-full for responsiveness
                );

                const imgElement = document.createElement('img');
                imgElement.src = image.imageUrl;
                imgElement.referrerpolicy = 'no-referrer'; // Keep this for hotlinking issues
                imgElement.alt = image.caption || 'Image from Google Sheet'; // Fallback alt text
                imgElement.onerror = () => {
                    // Fallback for broken images
                    imgElement.src = `https://placehold.co/600x400/cccccc/333333?text=Image+Load+Error`;
                    imgElement.alt = "Image failed to load";
                };
                // Apply Tailwind classes directly to the image
                // AGAIN NOT IMPORTANT
                imgElement.classList.add('w-full', 'h-auto', 'object-cover', 'rounded-t-lg');


                const captionElement = document.createElement('p');
                // Apply Tailwind classes directly to the caption
                captionElement.classList.add('p-4', 'text-center', 'text-gray-700', 'text-lg', 'font-medium');
                captionElement.textContent = image.caption || 'No Caption Provided'; // Display caption, or a default message

                // If there's a link, wrap the image and caption in an anchor tag
                if (image.link) {
                    const linkElement = document.createElement('a');
                    linkElement.href = image.link;
                    linkElement.target = "_blank"; // Open link in a new tab
                    linkElement.rel = "noopener noreferrer"; // Security best practice for target="_blank"
                    linkElement.classList.add('block'); // Apply Tailwind class for anchor
                    linkElement.appendChild(imgElement);
                    linkElement.appendChild(captionElement); // Caption is also part of the link
                    cardDiv.appendChild(linkElement);
                } else {
                    // If no link, just append image and caption directly to the card
                    cardDiv.appendChild(imgElement);
                    cardDiv.appendChild(captionElement);
                }

                imageDisplayArea.appendChild(cardDiv);
            });
        })
        .catch(error => {
            // Catch any errors during the fetch operation
            console.error('Fetch error:', error);
            displayError(`Failed to load images. ${error.message}`);
        });
});
