/**
 * purpose of this file is to make it easy to prompt a series of quesitons in the CML
 * and to save responses
 */
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// rl.question('What is your favorite programming language? ', a => {
// 	console.log(`YOUR ANSWER: ${a}`);
// 	rl.close();
// });

function getInput(question) {
	return new Promise((resolve, reject) => {
		rl.question(question, res => {
			resolve(res);
		});
	});
}

getInput('Have you ever committed a crime?').then(response => {
	console.log('-------');
	console.log(response);
});
