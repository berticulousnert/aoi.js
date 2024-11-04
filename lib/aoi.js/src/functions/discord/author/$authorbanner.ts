import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import AoiError from '@aoi.js/core/Error.js';

/**
 * Returns the banner of the author.
 * @example
 * ```aoi
 * ---
 * name: authorBanner
 * type: basic
 * ---
 *
 * $authorBanner // returns the banner of the author
 * ```
 */
const $authorbanner = new FunctionBuilder()
	.setName('$authorbanner')
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String | ReturnType.Void)
	.setBrackets(true)
	.setOptional(true)
	.setFields([
		{
			name: 'size',
			type: ReturnType.String,
			required: false,
			description: 'Size of the banner',
		},
		{
			name: 'dynamic',
			type: ReturnType.String,
			required: false,
			description: 'no clue',
		},
		{
			name: 'extention',
			type: ReturnType.String,
			required: false,
			description: 'The file extention',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const [size = '4096', dynamic = 'true', extension = 'png'] =
			thisArg.getParams(data);

		let parsedSize = thisArg.parseData(size, ReturnType.Number);

		if (!thisArg.isCorrectType(parsedSize, ReturnType.Number)) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'size' in function $authorBanner, got ${parsedSize} expected: number.`,
				data,
			);
		}

		const result = thisArg.getResultString(
			(discordData) =>
				discordData.author?.bannerURL({
					size: '$0',
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-ignore $1 is a placeholder
					forceStatic: !'$1',
					extension: '$2',
				}) ?? '',
			[size, dynamic, parseString(extension)],
		);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $authorbanner };
