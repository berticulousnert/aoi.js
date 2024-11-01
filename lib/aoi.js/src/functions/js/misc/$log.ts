import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { fixMath } from '@aoi.js/core/parsers/math.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Logs the message to the console
 * @example
 * ```aoi
 * ---
 * name: log
 * type: basic
 * ---
 * 
 * $log[Hello World] // Logs Hello World to the console
 * ```
 */
const $log = new FunctionBuilder()
	.setName('$log')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Function)
	.setFields([
		{
			name: 'message',
			type: ReturnType.String,
			required: true,
			description: 'The message to log.',
		},
	])
	.setReturns(ReturnType.Void)
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [message] = thisArg.getParams(data);

		if (!message && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.MissingParameter,
				'No message provided to log.',
				data,
			);
		}

		const parsed = parseString(fixMath(message));

		const resultString = thisArg.getResultString(
			() => {
				console.log('$0'); 
			},
			[parsed],
		);

		const escaped = escapeResult(resultString);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $log };
