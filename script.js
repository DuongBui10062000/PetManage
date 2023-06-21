'use strict';

// input field
const PetIDEl = document.getElementById('input-id');
const PetNameEl = document.getElementById('input-name');
const AgeEl = document.getElementById('input-age');
const TypeEl = document.getElementById('input-type');
const WeightEl = document.getElementById('input-weight');
const LengthEl = document.getElementById('input-length');
const ColorEl = document.getElementById('input-color-1');
const BreedEl = document.getElementById('input-breed');

const VaccinatedEl = document.getElementById('input-vaccinated');
const DewormedEl = document.getElementById('input-dewormed');
const SterilizedEl = document.getElementById('input-sterilized');

const btnSubmit = document.getElementById('submit-btn');
const btnShowHealthyPet = document.getElementById('healthy-btn');
const btnCalBmi = document.getElementById('bmi-btn');

const tblPetListEl = document.getElementById('tbody');

// pet array global
const petArr = [];

let isHealthy = false;

//===================== FUNCTIONS =========================
const checkNullInput = function (data, nameField) {
  //currentValue
  if (data === '') {
    alert(`Please input for ${nameField}`);
    return false;
  } else {
    return true;
  }
};

const validate = function (data) {
  // id***
  if (!checkNullInput(data.petID, 'ID')) {
    return false;
  }
  // check unique id
  let isExists = true; // stop funcition when id existsed
  petArr.forEach(function (item) {
    if (item.petID === data.petID) {
      alert('ID must be unique!');
      isExists = false;
    }
  });
  if (!isExists) {
    return false;
  }

  // name***
  if (!checkNullInput(data.petName, 'name')) {
    return false;
  }

  // age***
  if (!checkNullInput(data.age, 'age')) {
    return false;
  } else if (data.age < 1 || data.age > 15) {
    alert('Age must be between 1 and 15!');
    return false;
  }

  // type***
  if (data.type === 'Select Type') {
    alert('Please select Type!');
    return false;
  }

  // weight***
  if (!checkNullInput(data.weight, 'weight')) {
    return false;
  } else if (data.weight < 1 || data.weight > 15) {
    alert('weight must be between 1 and 15!');
    return false;
  }

  // length***
  if (!checkNullInput(data.lengths, 'length')) {
    return false;
  } else if (data.lengths < 1 || data.lengths > 100) {
    alert('Length must be between 1 and 100!');
    return false;
  }

  // breed
  if (data.breed === 'Select Breed') {
    alert('Please select Breed');
    return false;
  }

  return true;
};

const clearInput = function () {
  PetIDEl.value = '';
  PetNameEl.value = '';
  AgeEl.value = '';
  TypeEl.value = '';
  WeightEl.value = '';
  LengthEl.value = '';
  BreedEl.value = '';
  ColorEl.value = '#000000';

  VaccinatedEl.checked = false;
  DewormedEl.checked = false;
  SterilizedEl.checked = false;
};

const renderTableData = function (arr) {
  const check = '<i class="bi bi-check-circle-fill"></i>';
  const uncheck = '<i class="bi bi-x-circle-fill"></i>';

  // delete the old table
  tblPetListEl.innerHTML = '';

  // render pet list to a table
  for (let i = 0; i < arr.length; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `<th scope="row">${arr[i].petID}</th>
    <td>${arr[i].petName}</td>
    <td>${arr[i].age}</td>
    <td>${arr[i].type}</td>
    <td>${arr[i].weight} kg</td>
    <td>${arr[i].lengths} cm</td>
    <td>${arr[i].breed}</td>
    <td>
      <i class="bi bi-square-fill" style="color: ${arr[i].color}"></i>
    </td>
    <td>${arr[i].vaccinated ? check : uncheck}</td>
    <td>${arr[i].dewormed ? check : uncheck}</td>
    <td>${arr[i].sterilized ? check : uncheck}</td>
    <td class="bmi">?</td>
    <td>${arr[i].addDate}</td>
    <td>
      <button type="button" class="btn btn-danger" onclick=${`clickDelete('${arr[i].petID}')`}>Delete</button>
    </td>`;
    tblPetListEl.appendChild(row);
  }
};

// =========EVENTS CLICK==========

const clickSubmit = function () {
  let currentDate = new Date().toLocaleDateString();

  const data = {
    petID: PetIDEl.value.trim(),
    petName: PetNameEl.value.trim(),
    age: Number(AgeEl.value),
    type: TypeEl.value.trim(),
    weight: Number(WeightEl.value),
    lengths: Number(LengthEl.value),
    color: ColorEl.value.trim(),
    breed: BreedEl.value.trim(),
    vaccinated: VaccinatedEl.checked,
    dewormed: DewormedEl.checked,
    sterilized: SterilizedEl.checked,
    addDate: currentDate,

    calculateBmi: function () {
      if (this.type === 'Dog') {
        this.bmi = (this.weight * 703) / this.lengths ** 2;
      } else if (this.type === 'Cat') {
        this.bmi = (this.weight * 886) / this.lengths ** 2;
      }
      return (this.bmi = this.bmi.toFixed(2));
    },
  };

  if (validate(data)) {
    petArr.push(data);
    clearInput();
    PetIDEl.focus();
    renderTableData(petArr);
  }

  console.log(petArr);
};

const clickDelete = function (id) {
  for (let i = 0; i < petArr.length; i++) {
    if (petArr[i].petID === id) {
      if (confirm('Are you sure?')) {
        petArr.splice(i, 1);
        break;
      } else {
        break;
      }
    }
  }
  renderTableData(petArr);
};

const clickShowHealthyPet = function () {
  // pass element to healthyPetArr
  let healthyPetArr = petArr.filter(
    pet => pet.vaccinated && pet.dewormed && pet.sterilized
  );

  // check status of button show healthy or show all
  if (!isHealthy) {
    if (healthyPetArr.length > 0) {
      renderTableData(healthyPetArr);
      btnShowHealthyPet.textContent = 'Show All Pet';
      isHealthy = true;
    } else {
      alert('Have no healthy pet!');
    }
  } else {
    renderTableData(petArr);
    isHealthy = false;
  }
};

const clickCallBmi = function () {
  const bmi = document.querySelectorAll('.bmi');
  let i = 0;
  while (i < petArr.length) {
    petArr[i].calculateBmi();
    bmi[i].textContent = petArr[i].bmi;
    i++;
  }
};

// ==================== CONDITION HANDLE ========================
// 1. button submit
btnSubmit.addEventListener('click', clickSubmit);

// 2. button show healthy pet
btnShowHealthyPet.addEventListener('click', clickShowHealthyPet);

// 2. button BMI
btnCalBmi.addEventListener('click', clickCallBmi);
