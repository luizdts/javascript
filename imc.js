let nome = 'Luiz';
let sobrenome = 'Henrique';
const idade = 22;
const peso = 82;
const alturaMetro = 1.75
let imc = peso/Math.pow(alturaMetro,2)
let anoNascimento = 1999;

console.log(nome, sobrenome, 'tem', idade, 'anos', 'pesa', peso, 'kg')
console.log('tem', alturaMetro,'m', 'de altura e seu IMC é de: ', imc)
console.log(nome, sobrenome, 'nasceu em', anoNascimento)

// utilizando template strings

console.log(`tem ${alturaMetro}m de altura e seu IMC é de ${imc}`)
