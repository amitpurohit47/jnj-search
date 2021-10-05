import { useEffect, useState } from "react";
import searchIcon from "./loupe.png";
import jjlogo from "./JJ-logo.jpg";
import check from "./check.png";
import download from "./download-arrow.png";

import "./App.css";
import axios from "axios";

function App() {
  const [downloadAvailable, setDownloadAvailable] = useState(false);

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
      postData(file);
      document.querySelector(".successful-upload").style.opacity = 1;
      setTimeout(() => {
        document.querySelector(".successful-upload").style.opacity = 0;
      }, 3000);
    }
  }, []);

  const postData = async (file) => {
    try {
      setDownloadAvailable(false);
      await axios.post("http://127.0.0.1:5000/", { file });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    const val = document.querySelector("input-search");
    try {
      const url = "http://127.0.0.1:5000/runscript/" + val;
      const res = await axios.get(url);
      if (res.status.toString().toUpperCase() === "OK") {
        setDownloadAvailable(true);
      } else {
        alert("Invalid Input");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downloadReport = async () => {
    axios({
      url: "http://127.0.0.1:5000/get-files/output.xlsx",
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.csv");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <img src={jjlogo} alt="logo" className="jj-logo" />
      <button
        className={`download-result ${
          downloadAvailable ? "download-active" : ""
        }`}
        onClick={downloadReport}
      >
        <img src={download} alt="download" />
        Download
      </button>
      <div className="search-main">
        <form className="search-field" onSubmit={handleSearch}>
          <img src={searchIcon} alt="search" />
          <input type="text" className="input-search" />
        </form>
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
