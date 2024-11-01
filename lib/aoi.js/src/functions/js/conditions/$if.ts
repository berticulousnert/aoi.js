import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseCondition } from '@aoi.js/core/parsers/condition.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Executes the if block if the condition is true
 * @example
 * ```aoi
 * ---
 * name: if
 * type: basic
 * ---
 * 
 * $if[$message[1]==hi; hello]
 * $elseif[$message[1]==bye; goodbye]
 * $else[good day]
 * ```
 */
const $if = new FunctionBuilder()
	.setName('$if')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Scope)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'condition',
			type: ReturnType.Boolean,
			required: true,
			description: 'The condition to check.',
		},
		{
			name: 'code',
			type: ReturnType.Any,
			required: true,
			description: 'The code to execute if the condition is true.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [condition, ...code] = thisArg.getParams(data);
		const joinedCode = code.join(';');
		const transpiler = Transpiler.instance!;

		const { ast: conditionAst, scope: conditionScope } =
			transpiler.transpile(condition, {
				sendMessage: false,
				asFunction: false,
				scopeData: {
					vars: currentScope.variables,
					name: currentScope.name,
					object: currentScope.objects,
					env: currentScope.env,
				},
				reverse: data.cmd?.reverseRead ?? false,
				command: data.cmd,
			});

		currentScope.functions += conditionScope.functions + '\n';
		currentScope.packages += conditionScope.packages + '\n';

		const conditionResult = conditionAst.executed;

		const conditionToCheck = parseCondition(conditionResult).solve();

		const hash = Math.random().toString(36).substring(7);

		const { result: codeResult, scope: codeScope } = transpiler.transpile(
			joinedCode,
			{
				sendMessage: true,
				asFunction: false,
				scopeData: {
					vars: currentScope.variables,
					name: `${data.name}_${hash}`,
					object: currentScope.objects,
					env: currentScope.env,
				},
				reverse: data.cmd?.reverseRead ?? false,
				command: data.cmd,
			},
		);

		currentScope.functions += codeScope.functions + '\n';
		currentScope.packages += codeScope.packages + '\n';

		const result = thisArg.getResultString(() => {
			// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
			// @ts-ignore
			// eslint-disable-next-line no-constant-condition
			if ('$0') {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				('$1');
			}
		}, [conditionToCheck, codeResult]);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $if };
