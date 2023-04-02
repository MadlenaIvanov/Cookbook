import { e } from './dom.js';
import { showDetails } from './details.js';

async function getRecipes() {
    const response = await fetch('http://localhost:3030/data/recipes');
    const recipes = await response.json();

    return recipes;
}

async function getRecipeById(id) {
    const response = await fetch('http://localhost:3030/data/recipes/' + id);
    const recipe = await response.json();

    return recipe;
}

function createRecipePreview(recipe) {
    const result = e('article', { className: 'preview', onClick: () => showDetails(recipe._id)},
        e('div', { className: 'title' }, e('h2', {}, recipe.name)),
        e('div', { className: 'small' }, e('img', { src: recipe.img })),
    );

    return result;
}

function createRecipeCard(recipe) {
    const result = e('article', {},
        e('h2', {}, recipe.name),
        e('div', { className: 'band' },
            e('div', { className: 'thumb' }, e('img', { src: recipe.img })),
            e('div', { className: 'ingredients' },
                e('h3', {}, 'Ingredients:'),
                e('ul', {}, recipe.ingredients.map(i => e('li', {}, i))),
            )
        ),
        e('div', { className: 'description' },
            e('h3', {}, 'Preparation:'),
            recipe.steps.map(s => e('p', {}, s))
        ),
    );

    return result;
}

let main;
let section;
let setActiveNav;

export function setupCatalog(mainTarget, sectionTarget, setActiveNavCb){

    main = mainTarget;
    section = sectionTarget;
    setActiveNav = setActiveNavCb;
}

export async function showCatalog() {
    setActiveNav('catalogLink');
    
    section.innerHTML = '<p style="color: white">Loading...</p>'; 
    main.innerHTML = '';
    main.appendChild(section);

    const recipes = await getRecipes();
    const cards = recipes.map(createRecipePreview);

    section.innerHTML = '';
    cards.forEach(c => section.appendChild(c));
}