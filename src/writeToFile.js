const fs = require('fs');
const path = require('path');

// TESTING:
const dir = 'notebookzzz/';
const file_name = 'fommmo';
const file_ext = '.md';
const full_file_path = dir + file_name + file_ext;
saveDataAsFile(full_file_path);
console.log(__dirname);

async function saveDataAsFile(filepath, data) {
	const dir_name = path.join(__dirname, '../', path.dirname(filepath));
	const file_name = path.basename(filepath);
	const dirExists = await _fsAccessPromiseWrapper(dir_name);
	const fileExists = await _fsAccessPromiseWrapper(file_name);

	// Ensures that if the directory doesnt exist, create one
	if (!dirExists) {
		await _fsMkdirPromiseWrapper(dir_name);
	}

	if (dirExists && fileExists) {
		// TODO
		// confirm to user that you want to overwrite file
	} else if (dirExists && !fileExists) {
		// make the file & save data in that file
	}
}

//#region _fsAccessPromiseWrapper
/** ---- _fsAccessPromiseWrapper ----
 * helper fn that wraps native fs.access() functionality into a promise
 *
 * @param {*} filename
 * @return {bln} whether file exists or not
 */
function _fsAccessPromiseWrapper(filename) {
	return new Promise((resolve, reject) => {
		fs.access(filename, err => {
			err ? reject(err) : resolve(filename);
		});
	})
		.then(() => {
			return true;
		})
		.catch(err => {
			return false;
		});
}
//#endregion _fsAccessPromiseWrapper

//#region _fnMkdirPromiseWrapper
/** async _fsMkdirPromiseWrapper()
 *
 * @param {string} dir_name
 * @return {Promise}
 */
async function _fsMkdirPromiseWrapper(dir_name) {
	return new Promise((resolve, reject) => {
		fs.mkdir(dir_name, err => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
//#endregion

//#region DEPRECATED checkDirFileExistence()
/** -- async function checkDirFileExistence ----
 * ensures that the directory exists, checks if file exists
 *
 * @param {string} filepath
 * @return {obj: {dirExists: bln, fileExists: bln }} -
 */
// async function checkDirFileExistence(filepath) {
// 	const dir_name = path.dirname(filepath);
// 	const file_name = path.basename(filepath);
// 	const dirExists = await _fsAccessPromiseWrapper(dir_name);
// 	const fileExists = await _fsAccessPromiseWrapper(file_name);

// 	// Case: no directory, try creating one and reinvoking this function
// 	return new Promise((resolve, reject) => {
// 		if (!dirExists) {
// 			fs.mkdir(dir_name, err => {
// 				if (!err) {
// 					resolve(checkDirFileExistence(filepath));
// 				} else {
// 					reject(
// 						`Error: no directory found and failed to create a new directory "${dir_name}"`
// 					);
// 				}
// 			});
// 		} else {
// 			resolve({ dirExists, fileExists });
// 		}
// 	});
// }
//#endregion
