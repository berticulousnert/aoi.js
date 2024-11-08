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
			name: 'channelId',
			type: ReturnType.String,
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
			name: 'messageId',
			type: ReturnType.String,
			required: true,
			description: 'messageId to check',
		},
	])
	.setCode((data, scopes, thisArg) => {
		let [messageId, sep = ',', channelId] = thisArg.getParams(data);
		const currentScope = thisArg.getCurrentScope(scopes);
		let result;

		if (
			!messageId &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'messageId\' in function $messageexist.',
				data,
			);
		}

		if (!channelId) {
			channelId = thisArg.getResultString(
				(discordData) => discordData.channel?.id,
			);
		}

		let parsedChannelId = thisArg.parseData(channelId, ReturnType.String);
		if (!thisArg.isCorrectType(parsedChannelId, ReturnType.String) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'channelId' in function $messageflags, got ${parsedChannelId} expected: String.`,
				data,
			);
		}

		let parsedMessageId = thisArg.parseData(messageId, ReturnType.String);
		let parsedSeperator = thisArg.parseData(messageId, ReturnType.String);

		if (!thisArg.isCorrectType(parsedMessageId, ReturnType.String) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'messageId' in function $messageflags, got ${parsedMessageId} expected: String.`,
				data,
			);
		}

		if (!thisArg.isCorrectType(parsedSeperator, ReturnType.String) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'seperator' in function $messageflags, got ${parsedSeperator} expected: String.`,
				data,
			);
		}

		result = thisArg.getResultString(
			async (discordData) =>
			  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
			  //@ts-expect-error
			  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
				discordData.client.channels.cache.get('$0' || discordData.channel.id)?.messages.fetch('$1')?.flags.toArray().join('$2') ?? '',
			[parseString(channelId), parseString(messageId), parseString(sep)],
		  );

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $messageflags };
