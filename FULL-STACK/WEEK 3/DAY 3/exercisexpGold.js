//ex1. select kind of a music
const select = document.getElementById('genres');
console.log('Selected option:', select.value);
const newOption = document.createElement('option');
newOption.value = 'classic';
newOption.textContent = 'Classic';
newOption.selected = true;
select.appendChild(newOption);

//ex2. delete colors
const removeBtn = document.getElementById('removeBtn');
const colorSelect = document.getElementById('colorSelect');
function removecolor() {
    if (colorSelect.selectedIndex !== -1) {
        colorSelect.remove(colorSelect.selectedIndex);
    }
}

removeBtn.addEventListener('click', removecolor);
const root = document.getElementById('root');
let shoppingList = [];
const form = document.createElement('form');

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Add an item...';

const addButton = document.createElement('button');
addButton.type = 'submit';
addButton.textContent = 'AddItem';

const clearButton = document.createElement('button');
clearButton.type = 'button';
clearButton.textContent = 'ClearAll';
form.appendChild(input);
form.appendChild(addButton);
root.appendChild(form);
root.appendChild(clearButton);

function addItem(event) {
    event.preventDefault(); 
    
    const itemValue = input.value.trim();
    if (itemValue !== '') {
        shoppingList.push(itemValue);
        console.log('Shopping List:', shoppingList);
        input.value = ''; 
    }
}

function clearAll() {
    shoppingList = [];
    console.log('Shopping List cleared:', shoppingList);
}
form.addEventListener('submit', addItem);
clearButton.addEventListener('click', clearAll);