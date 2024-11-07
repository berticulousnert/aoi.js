import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the message flags
 * @example
 * ```aoi
 * ---
 * name: messageflags
 * type: basic
 * ---
 *
 * $messageflags // returns the message flags
 * ```
 */
const $messageflags = new FunctionBuilder()
	.setName('$messageflags')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'channelid',
			type: ReturnType.Number,
			required: false,
			description: 'channelId to use',
		},
		{
			name: 'sep',
			type: ReturnType.String,
			required: false,
			description: 'seperator to use',
		},
		{
			name: 'messageid',
			type: ReturnType.Number,
			required: true,
			description: 'messageId to check',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const [messageid, sep = ',', channelid] = thisArg.getParams(data);
		const currentScope = thisArg.getCurrentScope(scopes);
		let result;

		if (
			!messageid &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'messageid\' in function $messageexist.',
				data,
			);
		}

		if (channelid) {
			let parsedChannelId = thisArg.parseData(channelid, ReturnType.Number);
			if (!thisArg.isCorrectType(parsedChannelId, ReturnType.Number) && !thisArg.canSuppressAtComp(data, currentScope)) {
				throw AoiError.FunctionError(
					ErrorCode.InvalidArgumentType,
					`Invalid type for parameter 'channelid' in function $messageflags, got ${parsedChannelId} expected: number.`,
					data,
				);
			}
		}

		let parsedMessageId = thisArg.parseData(messageid, ReturnType.Number);
		let parsedSeperator = thisArg.parseData(messageid, ReturnType.String);

		if (!thisArg.isCorrectType(parsedMessageId, ReturnType.Number) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'messageid' in function $messageflags, got ${parsedMessageId} expected: number.`,
				data,
			);
		}

		if (!thisArg.isCorrectType(parsedSeperator, ReturnType.String) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'seperator' in function $messageflags, got ${parsedSeperator} expected: string.`,
				data,
			);
		}

		result = thisArg.getResultString(
			async (discordData) =>
			  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
			  //@ts-expect-error
			  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
				discordData.client.channels.cache.get('$0' || discordData.channel.id)?.messages.fetch('$1')?.flags.toArray().join('$2') ?? '',
			[parseString(channelid), parseString(messageid), parseString(sep)],
		  );

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $messageflags };
