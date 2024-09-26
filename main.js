const searchStartButton = document.querySelector("#starting-button");
const searchAnyButton = document.querySelector("#any-button");
const sortButton = document.querySelector("#sort-button");
const searchTextbox = document.querySelector("#search");
const description = document.querySelector("#description");
const listCountriesResult = document.querySelector("#countryList");

const h2 = document.querySelector("h2");
h2.textContent = `Total number of countries: ${countries.length}`;

let typeSearch = "STARTING_WORD";

// mac dinh active button Start word
searchStartButton.classList.toggle("active");
searchTextbox.focus();

// vao trang mac dinh hien thi tat ca country
showListCountry(countries);

// nhan vao button Starting word
searchStartButton.addEventListener("click", function(){
	typeSearch = "STARTING_WORD";
	//reset form
	resetForm();
	searchTextbox.focus();
	//hiển thị danh sách country
	showListCountry(countries);
	
})


searchAnyButton.addEventListener("click", function(){
	typeSearch = "ANY_WORD";
	//reset form
	resetForm();
	searchTextbox.focus();
	//hiển thị danh sách country
	showListCountry(countries);
	
})

searchTextbox.addEventListener("input", function(){
	let keyword = searchTextbox.value;
	let arrRs=[];
	if(keyword === ""){
		arrRs=countries;
		description.innerHTML = "";
	}else{
		arrRs = countries.filter(function(element){
			return (typeSearch==="STARTING_WORD" && element.toLowerCase().startsWith(keyword.toLowerCase()))
			|| (typeSearch==="ANY_WORD" && element.toLowerCase().includes(keyword.toLowerCase()));
		})

		if(typeSearch==="STARTING_WORD"){
			description.innerHTML = `Countries start with <b>${keyword}</b> are <b>${arrRs.length}</b>`;
		}else{
			description.innerHTML = `Countries containing <b>${keyword}</b> are <b>${arrRs.length}</b>`;
		}
	}
	//hien thi danh sach ket qua
	showListCountry(arrRs);
})

sortButton.addEventListener("click", function (){
	typeSearch = "SORT";
	// reset form
	resetForm();
	// sap xep danh sach hien tai theo thu tu nguoc lai
	countries.sort(function(a,b){
		return -1;
	})
	showListCountry(countries);
})

function resetForm(){
	searchTextbox.value = "";
	description.textContent = "";
	listCountriesResult.innerHTML="";
	searchStartButton.classList.toggle("active", typeSearch === "STARTING_WORD");
	searchAnyButton.classList.toggle("active", typeSearch === "ANY_WORD");
	sortButton.classList.toggle("active", typeSearch === "SORT");
}

// hien thi danh sach country 
function showListCountry(list){
	let divListCountries = "";
	for (const element of list) {
		divListCountries += `<div class="country">${element.toUpperCase()}</div>`;
	}
	listCountriesResult.innerHTML = divListCountries;
}
