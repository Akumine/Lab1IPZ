"use strict";

const CHANCE_TO_CHILD = 75;
const CHANCE_TO_MUTATION = 1;

let population = [];

iteration();

function iteration() {
	if ( confirm("Розпочати генетичний алгоритм для f(x)=-(17x2-14x+15)2/256, x є [0, 255] ?" ) ) {
		let countIterate = +prompt('Скільки ітерацій вам потрібно?', '');

		createIndivid();
		console.log( `Поточна популяція ${population}`);

		for(let i = 1; i <= countIterate; i++) {

			newGeneration();
			console.log(`Ітерація № ${i} завершена`);
			console.log( `Поточна популяція № ${i}: ${population}`);
		}
		return iteration();
	}
}

function createIndivid() {
	for (var i = 0; i < 26; i++) {
		let x = randomInteger(0, 255);

		createPopulation(x, i);
	} 
}

function createPopulation(individ, individNumber) {
	population[individNumber] = individ;
}

function calculationFunction() {
	let resFunc = population.map(function(elem) {
	return +(-( (17*elem*elem-14*elem+15) * (17*elem*elem-14*elem+15) ) / 256).toFixed(3);
	});

	return resFunc
}

function calculationFit() {
	let resFunc = calculationFunction();
	console.log("f(x):");
	
	let sumOfFunc = 0;
	for (let i = 0; i < resFunc.length; i++) {
		console.log(`${i}: ${resFunc[i]}`);
		sumOfFunc = +(sumOfFunc + resFunc[i]).toFixed(3);
	}
	

	let fitFunc = resFunc.map(function(elem) {
	return elem / sumOfFunc;
	});

	console.log("fnorm:");

	return fitFunc;
}

function proportion() {
	let fitFunc = calculationFit();

	let propor = [];
	for (let i = 0; i < fitFunc.length; i++) {
		console.log(`${i}: ${fitFunc[i]}`);
		if ( i != 0 ) {
			propor[i] = fitFunc[i] + propor[i-1];
		} else {
			propor[i] = fitFunc[i];
		  }
	}
	
	console.log("Cпіввідношення:");

	return propor;
}

function indexOfParents() {

	let propor = proportion();

	let xIndex = []

	for ( let i = 0; i < 26; i++  ) {

		let x = Math.random();

		for ( let j = 0; j < propor.length; j++) {
			console.log(`${i}: ${propor[i]}`);
			if (propor[j] > x) {
				xIndex.push(j);
				break;
			}
		}
		
	}
	
	console.log("Індекси особин популяції, що увійдуть до наступної:");

	return xIndex;
}

function parent() {

	let xIndex = indexOfParents();
	
	let parents = [];
	for(let i = 0; i < xIndex.length; i++) {
		console.log(`${i}: ${xIndex[i]}`);
		parents.push(population[xIndex[i]])
	}
	
	console.log("Батьки:");

	return parents;
}

function childs() {
	let parents = parent();
	for(let i = 0; i < parents.length; i++) {
		console.log(`${i}: ${parents[i]}`);
	};
	

	let descendants = [];

	for(let i = 25; i > 0; i = i-2 ) {

		let parent1 = Math.floor(Math.random() * (i+1) );
		let parent2 = Math.floor(Math.random() * (i+1) );

		while (parent1 == parent2) parent2 = Math.floor(Math.random() * (i+1) );

		let firstParent = parents[parent1];
		let secondParent = parents[parent2];

		let parent1Bin = firstParent.toString(2);
		let parent2Bin = secondParent.toString(2);
		
		if(parent1Bin.length < 8) {
			parent1Bin = addNulls(parent1Bin)
		}
		if(parent2Bin.length < 8) {
			parent2Bin = addNulls(parent2Bin)
		}

		let descendant1 = 0;
		let descendant2 = 0;

		if ( isSuccess(CHANCE_TO_CHILD) ) {

				let startBorder = randomInteger(0, 6);

				let endBorder = 0;
				
				if ( startBorder == 0 ) {
					endBorder = randomInteger(startBorder+1, 6);
				} else {
					endBorder = randomInteger(startBorder+1, 7);
				}
				if (startBorder == 0) {
				
					descendant1 = parent2Bin.substring(startBorder, endBorder+1) + parent1Bin.slice(endBorder+1, 8);
					descendant2 = parent1Bin.substring(startBorder, endBorder+1) + parent2Bin.slice(endBorder+1, 8);
			} else {
					if (endBorder == 7){
						descendant1 = parent1Bin.slice(0, startBorder) + parent2Bin.substring(startBorder, endBorder+1);
						descendant2 = parent2Bin.slice(0, startBorder) + parent1Bin.substring(startBorder, endBorder+1);
					} else {
						descendant1 = parent1Bin.slice(0, startBorder) + parent2Bin.substring(startBorder, endBorder+1) + parent1Bin.slice(endBorder+1, 8);
						descendant2 = parent2Bin.slice(0, startBorder) + parent1Bin.substring(startBorder, endBorder+1) + parent2Bin.slice(endBorder+1, 8);
					}
				}

		} else {
			descendant1 = parent1Bin;
			descendant2 = parent2Bin;
		}

		descendants.push(descendant1);
		descendants.push(descendant2);

		parents.splice(parent1, 1);
		parents.splice(parent2, 1);
	}
	console.log("Нащадки:");

	return descendants;
}

function mutation() {
	let newGen = childs()
	for(let i = 0; i < newGen.length; i++) {
		console.log(`${i}: ${newGen[i]}`);
		if( isSuccess(CHANCE_TO_MUTATION) ) {

			let bit = randomInteger(0, 8);

			if (newGen[i][bit] == 0) {
				if (bit == 0){
				newGen[i] = "1" + newGen[i].slice(1);
				} else {
					newGen[i] = newGen[i].slice(0, bit) + "1" + newGen[i].slice(bit+1);
				}
			} else {

				if (bit == 0){
				newGen[i] = "0" + newGen[i].slice(1);
				} else {
					newGen[i] = newGen[i].slice(0, bit) + "0" + newGen[i].slice(bit+1);
				}
			}
		}
	} 
	
	console.log("Нащадки після мутації:");

	return newGen;
}

function newGeneration () {
	let newGenBin = mutation();

	for (let i = 0; i < newGenBin.length; i++ ) {
		console.log(`${i}: ${newGenBin[i]}`);
		population[i] = parseInt(newGenBin[i], 2);
	}
	
	return;
}

function randomInteger(min, max) {

	let rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}

function addNulls(parent) {
	switch(parent.length) {
		case 7:
			parent = "0" + parent;
			break;
		case 6:
			parent = "00" + parent;
			break;
		case 5:
			parent = "000" + parent;
			break;
		case 4:
			parent = "0000" + parent;
			break;
		case 3:
			parent = "00000" + parent;
			break;
		case 2:
			parent = "000000" + parent;
			break;
		case 1:
			parent = "0000000" + parent;
			break;
	}
	return parent;
}

function isSuccess(percentage) {
	if ( Math.floor(Math.random() * 101) <= percentage ) return true;
		return false;
}