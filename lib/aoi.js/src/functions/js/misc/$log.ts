import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { TranspilerError } from '@aoi.js/core/Error.js';
import { fixMath } from '@aoi.js/core/parsers/math.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

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
			throw TranspilerError.CompileError(
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
