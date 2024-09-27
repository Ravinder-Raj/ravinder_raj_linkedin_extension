import "./popup/App.css";
import { FaArrowRight } from "react-icons/fa"; // Import the arrow icon
import logo from './Frame.png'

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"], // LinkedIn URL
  main() {
    const showModal = () => {
      // Create a modal overlay (background) that will detect clicks outside the modal

      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      // overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
      overlay.style.zIndex = "9999"; // Ensure the overlay is on top
      overlay.style.display = "none"; // Start hidden
      overlay.id = "modal-overlay";

      // Create modal
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "65%";
      modal.style.left = "62%";
      modal.style.transform = "translate(-50%, -50%)";
      modal.style.backgroundColor = "white";
      modal.style.padding = "20px";
      modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      modal.style.zIndex = "10000"; // Ensure the modal is on top of the overlay
      modal.style.width = "500px"; // Set a fixed width
      modal.style.height = "10px";
      modal.style.borderRadius = "10px"; // Make the modal look nicer

      // Set height to auto and max height for better UX
      modal.style.height = "auto"; // Allow modal to expand based on content
      modal.style.maxHeight = "100%"; // Maximum height of the modal (80% of the viewport)
      modal.id = "ai-modal";

      // Create input field
      const inputField = document.createElement("textarea");
      inputField.placeholder = "Type your query here...";
      inputField.style.width = "100%";
      inputField.style.height = "50px";
      inputField.style.marginBottom = "10px";

      const generateButton = document.createElement("button");
      generateButton.className =
        "bg-blue-500 text-white p-2  rounded flex items-center align flex float-right"; // Add flex and items-center for alignment

      // Create an SVG element for the icon
      const iconSVG = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      iconSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      iconSVG.setAttribute("viewBox", "0 0 24 24");
      iconSVG.setAttribute("fill", "currentColor");
      iconSVG.setAttribute("class", "w-6 h-6 mr-2"); // Tailwind classes for size and margin

      // Add the SVG path for the send icon
      const iconPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      iconPath.setAttribute("d", "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"); // Example path for a send icon

      iconSVG.appendChild(iconPath);
      generateButton.appendChild(iconSVG);

      // Add text to the button
      const buttonText = document.createTextNode("Generate");
      generateButton.appendChild(buttonText);

      // Add the button to the DOM
      document.body.appendChild(generateButton);

      // Create area to display the chat messages
      const chatArea = document.createElement("div");
      chatArea.className = "chat-area mt-4 ";
      chatArea.style.minHeight = "50px"; // Set a minimum height for the chat area
      modal.style.height = "280px;";

      modal.appendChild(inputField);
      modal.appendChild(generateButton);
      modal.appendChild(chatArea);
      overlay.appendChild(modal); // Append modal inside overlay
      document.body.appendChild(overlay); // Append overlay to the body

      // Function to handle generation and update the UI with chat-like structure
      const generateResponse = () => {
        const userMessage = inputField.value.trim();

        // If the input field is empty, don't proceed
        if (!userMessage) {
          alert("Please enter a query.");
          return;
        }

        // Create chat bubble for the user's message on the right
        const userChatBubble = document.createElement("div");
        userChatBubble.style.display = "flex";
        userChatBubble.style.justifyContent = "flex-end"; // Aligns to the right
        userChatBubble.innerHTML = `
          <div style="position:relative; background-color: #dfe1e7; color:#666d80; padding: 10px; border-radius: 10px; top:0px; max-width: 400px; word-wrap: break-word;">
            ${userMessage}
          </div>
        `;

        // Generate the AI response
        const aiResponse = `
          <div style="display: flex; justify-content: flex-start; margin-top: 10px;">
            <div style="background-color: #dbeafe; color:#666d80; padding: 10px; border-radius: 10px; max-width: 400px; word-wrap: break-word;">
              Here's a generated response for you. Thank you for reaching out!
            </div>
          </div>
        `;

        // Append user's message to the chat area
        chatArea.appendChild(userChatBubble);

        // Remove input field and generate button
        modal.innerHTML = ""; // Clear modal content
        modal.appendChild(chatArea); // Re-append chat area with messages

        // Append AI response to the chat area
        chatArea.innerHTML += aiResponse;

        // Create "Your prompt" label and input box
        const promptLabel = document.createElement("label");
        promptLabel.className = "block mt-4 font-bold"; // Tailwind CSS for styling

        const promptInput = document.createElement("input");
        promptInput.type = "text";
        promptInput.placeholder = "Your prompt";
        promptInput.className = "border p-2 w-full mt-2 rounded"; // Add styling as per your design

        // Append the label and input box to the modal
        modal.appendChild(promptLabel);
        modal.appendChild(promptInput);

        // Create the buttons
        const regenerateButton = document.createElement("button");
        regenerateButton.innerText = "Regenerate";
        regenerateButton.className =
          "bg-[#3b82f6] text-white p-2 rounded mt-3 float-end gap-5 flex m-auto justify-center";
        regenerateButton.style.marginLeft = "10px";

        const insertButton = document.createElement("button");
        insertButton.innerText = "Insert";
        insertButton.className =
          "text-white p-2 border-m rounded mt-3 float-end text-[#777d8e] flex m-auto justify-center";

        // Create an SVG element for the loop icon
        const loopIconSVG = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        loopIconSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        loopIconSVG.setAttribute("viewBox", "0 0 24 24");
        loopIconSVG.setAttribute("fill", "currentColor");
        loopIconSVG.setAttribute("class", "w-6 h-6 mt-3"); // Tailwind classes for size and margin

        // Add the SVG path for the loop icon
        const loopIconPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        loopIconPath.setAttribute(
          "d",
          "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.64-.66 3.13-1.73 4.22l1.42 1.42C19.07 15.9 20 14.05 20 12c0-4.42-3.58-8-8-8zm-6.27.78L4.31 6.2C3.24 7.27 2.6 8.76 2.6 10.4c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.64.66-3.13 1.73-4.22z"
        ); // Example path for a loop icon

        loopIconSVG.appendChild(loopIconPath);
        regenerateButton.insertBefore(loopIconSVG, regenerateButton.firstChild); // Add the icon before the text

        // Create an SVG element for the down arrow with tail icon
        const downArrowTailIconSVG = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        downArrowTailIconSVG.setAttribute(
          "xmlns",
          "http://www.w3.org/2000/svg"
        );
        downArrowTailIconSVG.setAttribute("viewBox", "0 0 24 24");
        downArrowTailIconSVG.setAttribute("fill", "currentColor");
        downArrowTailIconSVG.setAttribute("class", "w-6 h-6 mt-3 "); // Tailwind classes for size and margin

        // Add the SVG path for the down arrow with tail icon
        const downArrowTailIconPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        downArrowTailIconPath.setAttribute("d", "M7 10l5 5 5-5H7z"); // Example path for a down arrow with tail icon

        downArrowTailIconSVG.appendChild(downArrowTailIconPath);
        insertButton.insertBefore(
          downArrowTailIconSVG,
          insertButton.firstChild
        ); // Add the icon before the text

        // Append the buttons to the DOM (assuming you have a parent element to append to)
        document.body.appendChild(regenerateButton);
        document.body.appendChild(insertButton);

        // Append buttons below the prompt input box
        modal.appendChild(regenerateButton);
        modal.appendChild(insertButton);

        // Insert functionality
        insertButton.addEventListener("click", () => {
          const messageInput = document.querySelector(
            ".msg-form__contenteditable"
          );
          if (messageInput) {
            const aiGeneratedResponse =
              promptInput.value ||
              "Here's a generated response for you. Thank you for reaching out!";

            // Focus on the message input to ensure it accepts the command
            (messageInput as HTMLElement).focus();

            // Use execCommand to insert text like real user input
            document.execCommand("insertText", false, aiGeneratedResponse);

            // Close the modal after insertion
            document.getElementById("modal-overlay")!.style.display = "none";
          }
        });

        // Dummy regenerate functionality (can be implemented later)
        regenerateButton.addEventListener("click", () => {
          console.log("Regenerate clicked (currently does nothing)");
        });
      };

      // Generate button functionality
      generateButton.addEventListener("click", () => {
        generateResponse();
      });

      // Close modal when clicking outside of it (except when clicking on the AI icon)
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.style.display = "none";
        }
      });

      return overlay; // Return the whole overlay (modal + background)
    };

    const createAIIcon = () => {
const aiIcon = document.createElement("div");

// Create the img element
const img = document.createElement("img");

// Set the src attribute to the path of your PNG image
// img.src = "https://cdn-icons-png.flaticon.com/128/1998/1998307.png"; // Replace with your actual PNG file path
img.src = logo; 

// Set the image width and height
img.style.width = "50px";
img.style.height = "50px";

// Style the div containing the image
aiIcon.style.position = "fixed";
aiIcon.style.bottom = "5px";
aiIcon.style.right = "20px";
aiIcon.style.cursor = "pointer";
aiIcon.style.zIndex = "10000";

// Append the img element to the div
aiIcon.appendChild(img);

// Append the div to the document body
document.body.appendChild(aiIcon);
      
      
 

      // Add event listener to show modal when clicked
      aiIcon.addEventListener("click", () => {
        const existingOverlay = document.getElementById("modal-overlay");

        if (existingOverlay) {
          // If the modal is already present, show it
          existingOverlay.style.display = "block";
        } else {
          // Otherwise, create the modal and show it
          const modalOverlay = showModal();
          modalOverlay.style.display = "block"; // Show the modal by setting display to block
        }
      });
           // Append the SVG to the div
           // aiIcon.appendChild(svg); // Removed undefined variable 'svg'

      document.body.appendChild(aiIcon);
      console.log("AI Icon added to the DOM:", aiIcon); // Check if the icon is added

      return aiIcon;
    };

    const attachEvents = () => {
      const overlay = showModal(); // The modal with the overlay
      const aiIcon = createAIIcon();

      // Observe for changes to detect the message input box
      const observer = new MutationObserver(() => {
        const messageInput = document.querySelector(
          ".msg-form__contenteditable"
        );
        if (messageInput) {
          console.log("Message input found:", messageInput);

          // Position the AI icon next to the message input field
          const messageInputRect = messageInput.getBoundingClientRect();
          aiIcon.style.top = `${messageInputRect.top + 55 + window.scrollY}px`;
          aiIcon.style.left = `${
            messageInputRect.right - 50 + window.scrollX
          }px`; // Position the icon to the right of the input
          aiIcon.style.display = "block"; // Show the AI icon

          // Handle AI icon click to display modal
          aiIcon.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent this click from triggering the document event
            console.log("AI icon clicked");
            overlay.style.display = "block"; // Show the modal (with overlay)
          });

          // Prevent the input from losing focus when aiIcon is clicked
          let isIconClicked = false;

          // **Prevent the input from losing focus when aiIcon is clicked**
          aiIcon.addEventListener("mousedown", () => {
            isIconClicked = true;
          });

          // **Hide the icon when the input field loses focus, unless the icon was clicked**
          messageInput.addEventListener("blur", () => {
            if (!isIconClicked) {
              aiIcon.style.display = "none"; // Hide the icon
            }
            isIconClicked = false; // Reset after blur event
          });

          // **Show the icon when the input field is focused again**
          messageInput.addEventListener("focus", () => {
            aiIcon.style.display = "block"; // Show the icon
            aiIcon.style.position = "fixed";
          });

          observer.disconnect(); // Stop observing once the input is found
        } else {
          console.log("Message input not found yet");
          aiIcon.style.display = "none"; // Hide the icon if not on the messaging page
        }
      });

      // Observe the body for changes until the message input is found
      observer.observe(document.body, { childList: true, subtree: true });

      // Handle clicks outside the modal to close it
      document.addEventListener("click", (event) => {
        const modalContent = document.querySelector("#ai-modal"); // Use the modal's actual ID

        // Close the modal if the click is outside the modal and not on the AI icon
        if (
          overlay.style.display === "block" && // If the modal is displayed
          !(modalContent && modalContent.contains(event.target as Node)) && // Click happened outside the modal
          !aiIcon.contains(event.target as Node) // Click happened outside the AI icon
        ) {
          overlay.style.display = "none"; // Close the modal
        }
      });

      // Stop propagation when clicking inside modal to prevent closing
      const modalContent = document.querySelector("#ai-modal"); // Use the modal's actual ID
      if (modalContent) {
        modalContent.addEventListener("click", (event) => {
          event.stopPropagation(); // Stop the event from bubbling up to the document listener
        });
      }
    };

    attachEvents();
  },
});
