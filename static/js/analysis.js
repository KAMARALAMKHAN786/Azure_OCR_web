document
  .getElementById("upload-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const apiKey = "403271e6f11d44e7803450bd3e7ec762";
    const apiUrl =
      "https://formrecognizerbill.cognitiveservices.azure.com//formrecognizer/documentModels/foodbill1:analyze?api-version=2023-07-31";

    const imageInput = document.getElementById("image-input");
    if (!imageInput.files || imageInput.files.length === 0) {
      alert("Please select an image file.");
      return;
    }

    const imageFile = imageInput.files[0];

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "application/octet-stream",
        },
        body: imageFile,
      });

      if (response.ok) {
        const operationLocation = response.headers.get("Operation-Location");
        document.getElementById(
          "result"
        ).innerHTML = `Operation Location: ${operationLocation}`;
        await waitForAnalysisResultAndSave(operationLocation, imageFile); // Pass imageFile as a parameter
      } else {
        const errorText = await response.text();
        document.getElementById("result").innerHTML = `Error: ${errorText}`;
      }
    } catch (error) {
      document.getElementById(
        "result"
      ).innerHTML = `An error occurred: ${error.message}`;
    }
  });

async function waitForAnalysisResultAndSave(operationLocation, imageFile) {
  const apiKey = "403271e6f11d44e7803450bd3e7ec762";

  try {
    while (true) {
      const response = await fetch(operationLocation, {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Response JSON:", result);

        if (result.status === "succeeded") {
          // Extract the data you want to save
          const dataToSave = {
            image_name: imageFile.name, // Extract image name
            json_data: JSON.stringify(result), // Store the entire JSON
          };

          console.log("Data to save:", dataToSave); // Log the data

          // Send the data to your Django backend for saving
          await saveAnalysisResultToDjango(dataToSave);

          // Render the analysis results as before
        //   renderAnalysisResults(result);
        //   console.log(result);

          // Extract fields and values using object iteration
          extractFieldsAndValues(result);
          renderAnalysisResults(parsed_results);
          break;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
      renderAnalysisResults(parsed_results);
    }
  } catch (error) {
    document.getElementById(
      "analysis-result"
    ).innerHTML = `An error occurred while retrieving analysis result: ${error.message}`;
    renderAnalysisResults(parsed_results);
  }
  renderAnalysisResults(parsed_results);
}

async function saveAnalysisResultToDjango(dataToSave) {
  try {
    const response = await fetch("/save-analysis-result/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSave),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message); // Success message from Django
    } else {
      const errorText = await response.text();
      console.error("Error saving analysis result:", errorText);
    }
  } catch (error) {
    console.error("Error saving analysis result:", error);
  }
}




function renderAnalysisResults(parsed_results) {
  const analysisResultContainer = document.getElementById("analysis-result");

  parsed_results.forEach(result => {
      const analysisEntry = document.createElement("div");
      analysisEntry.classList.add("analysis-entry");
      analysisEntry.innerHTML = `
          <h2>Image Name: ${result.image_name}</h2>
          <table>
              <thead>
                  <tr>
                      ${Object.keys(result.parsed_fields).map(fieldName => `<th>${fieldName}</th>`).join('')}
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      ${Object.values(result.parsed_fields).map(fieldData => `<td>${fieldData.valueString}</td>`).join('')}
                  </tr>
              </tbody>
          </table>
      `;
      analysisResultContainer.appendChild(analysisEntry);
  });
}