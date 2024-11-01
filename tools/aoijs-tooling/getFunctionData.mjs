/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import fs, { existsSync } from 'fs';
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

/**
 * Get the function data from the given file
 * @param {string} fnPath - The file path
 * @returns {Promise<object>} - The function data
 */
async function _getFnData(fnPath) {
	const fn = fnPath.split(path.sep).pop().replace('.ts', '');
	// fnPath = fnPath.replace('.ts', '.js');
	fnPath = pathToFileURL(fnPath);

	const module = (await import(fnPath));
	const object = module[fn];
	// console.log(module, object, fn, fnPath);
	return object;
}

/**
 * Get the jsDoc content from the given file
 * @param {string} fpPath - The file path
 */
async function getJsDocContent(fpPath) {

	// read the jsDoc from the file
	const content = await readFile(fpPath, 'utf-8');

	// extract the jsDoc
	let jsDoc = content.match(/\/\*\*([\s\S]*?)\*\//g);

	// console.log(jsDoc);
	if (!jsDoc) {
		console.log('No jsDoc found');
		process.exit(1);
	}

	jsDoc = jsDoc[0].split('/**')[1].trim().split('*/')[0].trim();

	const description = jsDoc.split('@')[0].trim().replaceAll('*', '').split('\n').map((line) => line.trim()).join('\n');

	const example = jsDoc.split('@example')[1].trim().replaceAll('*', '').split('\n').map((line) => line.trim()).join('\n');

	const remarks = jsDoc.split('@remarks')[1]?.trim().replaceAll('*', '').split('\n').map((line) => line.trim()).join('\n').split('@')[0].trim();

	const notes = jsDoc.split('@notes')[1]?.trim().replaceAll('*', '').split('\n').map((line) => line.trim()).join('\n').split('@')[0].trim();

	return {
		description,
		example,
		remarks,
		notes,
	};
}

/**
 * get the function Metadata from the given file
 * @param {string} fpath - The path to the directory 
 */
export async function getMetaData(fpath) {
	if (!existsSync(fpath))
		throw new Error(
			`The path ${fpath} does not exist. Please provide a valid path.`,
		);

	const isDir = (await stat(fpath)).isDirectory();

	if (isDir) {
		const files = await readdir(fpath);

		const filteredFiles = files.filter(
			(file) =>
				file.endsWith('.ts') &&
				!file.endsWith('.test.ts') &&
				file.startsWith('$'),
		);

		const res = [];

		for (const file of filteredFiles) {
			const jsDocData = await getJsDocContent(`${fpath}/${file}`);
			const fnData = await _getFnData(`${fpath}/${file}`);
			res.push({
				...jsDocData,
				...fnData,
			});
		}

		return res;
	} else {
		const jsDocData = await getJsDocContent(fpath);
		const fnData = await _getFnData(fpath);
		// console.log({fnData, jsDocData});
		return {
			...jsDocData,
			...fnData,
		};
	}

}

const argvs = process.argv.slice(3);

const flags = argvs.reduce((acc, arg) => {
	const [key, value] = arg.split('=');
	acc[key.replace('--', '')] = value;
	return acc;
}, {});

// recursively go through src folder and find all test files
let fpPath = './src';
if (flags.file) {
	fpPath += `/${flags.file}`;
}

fpPath = path.resolve(process.cwd(), fpPath);

console.log(await getMetaData(fpPath));