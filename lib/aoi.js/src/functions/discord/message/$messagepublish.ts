import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Published the announcement in a channel
 * @example
 * ```aoi
 * ---
 * name: messagepublish
 * type: basic
 * ---
 *
 * $messagepublish // publishes the announcement in a channel
 * ```
 */
const $messagepublish = new FunctionBuilder()
	.setName('$messagepublish')
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
			name: 'messageid',
			type: ReturnType.Number,
			required: false,
			description: 'messageId to check',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const [messageid, channelid] = thisArg.getParams(data);
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
			if (
				!thisArg.isCorrectType(parsedChannelId, ReturnType.Number) &&
				!thisArg.canSuppressAtComp(data, currentScope)
			) {
				throw AoiError.FunctionError(
					ErrorCode.InvalidArgumentType,
					`Invalid type for parameter 'channelid' in function $messagepublish, got ${parsedChannelId} expected: number.`,
					data,
				);
			}
		}

		let parsedMessageId = thisArg.parseData(messageid, ReturnType.Number);

		if (
			!thisArg.isCorrectType(parsedMessageId, ReturnType.Number) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'messageid' in function $messagepublish, got ${parsedMessageId} expected: number.`,
				data,
			);
		}

		result = thisArg.getResultString(
			async (discordData) =>
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-expect-error
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
				(await discordData.client.channels.cache.get('$0' || discordData.channel.id)?.messages.fetch('$1'))?.crosspost() ?? '',
			[parseString(channelid), parseString(messageid)],
		);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $messagepublish };
