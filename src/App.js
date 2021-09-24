import { useEffect } from "react";
import searchIcon from "./loupe.png";
import jjlogo from "./JJ-logo.jpg";
import check from "./check.png";
import download from "./download-arrow.png";
import "./App.css";

function App() {
  useEffect(() => {
    document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
      const dropZoneElement = inputElement.closest(".drop-zone");

      dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
      });

      inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
          updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
      });

      dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
      });

      ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
          dropZoneElement.classList.remove("drop-zone--over");
        });
      });

      dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
          inputElement.files = e.dataTransfer.files;
          updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }

        dropZoneElement.classList.remove("drop-zone--over");
      });
    });

    /**
     * Updates the thumbnail on a drop zone element.
     *
     * @param {HTMLElement} dropZoneElement
     * @param {File} file
     */
    function updateThumbnail(dropZoneElement, file) {
      let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

      // First time - remove the prompt
      if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
      }

      // First time - there is no thumbnail element, so lets create it
      if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");
        dropZoneElement.appendChild(thumbnailElement);
      }

      thumbnailElement.dataset.label = file.name;

      // Show thumbnail for image files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
          thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
        };
      } else {
        thumbnailElement.style.backgroundImage = null;
      }
      document.querySelector(".successful-upload").style.opacity = 1;
      setTimeout(() => {
        document.querySelector(".successful-upload").style.opacity = 0;
      }, 3000);
    }
  }, []);

  return (
    <div className="App">
      <img src={jjlogo} alt="logo" className="jj-logo" />
      <button className="download-result">
        <img src={download} alt="download" />
        Download
      </button>
      <div className="search-main">
        <div className="search-field">
          <img src={searchIcon} alt="search" />
          <input type="text" />
        </div>
        <div className="drop-zone">
          <span className="drop-zone__prompt">
            Click here to upload template and generate multiple search term data
            pull
          </span>
          <input type="file" name="myFile" className="drop-zone__input" />
        </div>
        <div className="successful-upload">
          <img src={check} alt="check" />
          <p>File Upload Successful</p>
        </div>
      </div>
    </div>
  );
}

export default App;
