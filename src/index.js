//import { debounce } from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

import './css/styles.css';

const debounce = require('lodash.debounce');

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
            console.log(response.length);
            if (response.length === 1) {
                countryInfoRender(response);
            } else if (response.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.')
            } else {
                countryListRender(response);
            }
        })
        .catch(error => Notify.failure("Oops, there is no country with that name"));
}

function countryInfoRender(name) {
    const infoMarkup = name
        .map(({ name, capital, population, flags, languages }) => {
            return `<ul class="country-info__list">
            <li class="country-info__item">
            <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
            <h2>${name.official}</h2></li>
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
        </ul>`;
}).join('');
    
    refs.info.innerHTML = infoMarkup;
    refs.list.innerHTML = '';
}

function countryListRender(name) {
    const searchMarkup = name
        .map(({ name, flags }) => {
            return `
        <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.common}" width = 25px height = 15px>
              <p class="country-list__name">${name.common}</p>
          </li>`;
    }).join('');

    refs.list.innerHTML = searchMarkup;
    refs.info.innerHTML = '';
}

