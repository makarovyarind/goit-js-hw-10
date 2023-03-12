
const REST_URL = 'https://restcountries.com/v3.1/name/';

export function fetchCountries(name) {
  return fetch(
    `${REST_URL}${name}?fields=name.official,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
            throw new Error(response.status);
        }
    return response.json();
  });
}