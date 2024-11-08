import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * check if the message exist
 * @example
 * ```aoi
 * ---
 * name: messageexists
 * type: basic
 * ---
 *
 * $messageexists // checks if the message exist
 * ```
 */
const $messageexists = new FunctionBuilder()
	.setName('$messageexists')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'channelId',
			type: ReturnType.Number,
			required: false,
			description: 'channelId to use',
		},
		{
			name: 'messageId',
			type: ReturnType.Number,
			required: true,
			description: 'messageId to check',
		},
	])
	.setCode((data, scopes, thisArg) => {
		let [messageId, channelId] = thisArg.getParams(data);
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

		let parsedMessageId = thisArg.parseData(messageId, ReturnType.Number);
		let parsedChannelId = thisArg.parseData(messageId, ReturnType.Number);

		if (
			!thisArg.isCorrectType(parsedChannelId, ReturnType.Number) &&
				!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'channelId' in function $messageexist, got ${parsedChannelId} expected: number.`,
				data,
			);
		}

		if (
			!thisArg.isCorrectType(parsedMessageId, ReturnType.Number) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'messageId' in function $messageexist, got ${parsedMessageId} expected: number.`,
				data,
			);
		}

		result = thisArg.getResultString(
			async (discordData) =>
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-expect-error
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				!!discordData.client.channels.cache.get('$0' || discordData.channel.id)?.messages.fetch('$1'),
			[parseString(channelId), parseString(messageId)],
		);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $messageexists };
