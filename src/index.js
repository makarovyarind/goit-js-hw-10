import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { Notify } from "notiflix";
import { fetchCountries } from './fetchCountries';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info')
};

refs.input.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(e) {
    
    const name = e.target.value.trim();
    
    fetchCountries(name)
        .then(response => {
            refs.list.innerHTML = '';
            refs.info.innerHTML = '';
            
            if (response.length === 1) {
                refs.info.insertAdjacentElement('beforeend', countryInfoRender(response));
            } else if (response.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
            } else {
                refs.list.insertAdjacentElement('beforeend', countryListRender(response));
            }
        })
        .catch(error => Notify.failure("Oops, there is no country with that name"));
}

function countryInfoRender(name) {
    const infoMarkup = name
        .map(({ name, capital, population, flags, languages }) => {
return `<img 
    src="${flags.svg}" 
    alt="${name.official}" width = "25" height = "15" />
    <h1>${name.official}</h1>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${languages.map(el => el.name).join(', ')}</p>`;
}).join('');
    
    return infoMarkup;
}

function countryListRender(name) {
    const searchMarkup = name
        .map(({ name, flags }) => {
        return `<li>
    <img src="${flags.svg}" 
    alt="${name.official}" 
    width = "25" 
    height = "15" />
  <p>${name.official}</p>
</li>`;
    }).join('');

    return searchMarkup;
}

