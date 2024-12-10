// Elementos del DOM
const countrySelect = document.getElementById("countrySelect");
const countryForm = document.getElementById("countryForm");
const resultDiv = document.getElementById("result");

class SearchCountry {
  constructor(settings) {}

  async LoadCountries() {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const countries = await response.json();

      // Ordenar los países alfabéticamente por su nombre común
      const sortedCountries = countries.sort((a, b) => {
        const nameA = a.name.common.toLowerCase();
        const nameB = b.name.common.toLowerCase();
        return nameA.localeCompare(nameB);
      });

      // Poblar el selector con los nombres de los países
      sortedCountries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.name.common; // Nombre común como valor
        option.textContent = country.name.common; // Nombre común como texto
        countrySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar los países:", error);
      resultDiv.innerHTML =
        '<p style="color: red;">Error al cargar la lista de países.</p>';
    }
  }

  async FetchCountryData(event) {
    event.preventDefault();

    const selectedCountry = countrySelect.value;

    if (!selectedCountry) {
      resultDiv.innerHTML =
        '<p style="color: red;">Por favor seleccione un país.</p>';
      return;
    }

    resultDiv.innerHTML = "Cargando...";

    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${selectedCountry}`
      );

      if (!response.ok) {
        throw new Error("País no encontrado");
      }

      const data = await response.json();
      const country = data[0]; // Primer resultado

      // Extraer información
      const nameCommon = country.name.common || "N/A";
      const nameOfficial = country.name.official || "N/A";
      const currencyName = country.currencies
        ? Object.values(country.currencies)[0].name
        : "N/A";
      const region = country.region || "N/A";
      const capital = country.capital ? country.capital[0] : "N/A";
      const area = country.area || "N/A";
      const googleMaps = country.maps.googleMaps || "#";

      // Mostrar resultados
      resultDiv.innerHTML = `
        <div class='container-data col-lg-8 m-auto'>
        <h2 class='sub-tittle'>Información de ${nameCommon}</h2>
        <p><strong>Nombre Común:</strong> ${nameCommon}</p>
        <p><strong>Nombre Oficial:</strong> ${nameOfficial}</p>
        <p><strong>Moneda:</strong> ${currencyName}</p>
        <p><strong>Región:</strong> ${region}</p>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Área:</strong> ${area} km²</p>
        <p><strong>Mapa:</strong> <a href="${googleMaps}" target="_blank">Ver en Google Maps</a></p>
        </div>
      `;
    } catch (error) {
      resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
  }
}

window.JS_SearchCountry = new SearchCountry();

// Inicializar
window.addEventListener("DOMContentLoaded", JS_SearchCountry.LoadCountries);
countryForm.addEventListener("submit", JS_SearchCountry.FetchCountryData);
