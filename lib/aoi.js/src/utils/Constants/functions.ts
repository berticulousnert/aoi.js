import { escapeResult } from '../Helpers/core.js';
const DISCORD_DATA = '__$DISCORD_DATA$__';

const DEFAULTS = {
	channel: (prop: string) => escapeResult(`${DISCORD_DATA}.channel?.${prop}`),
};

export default DEFAULTS;
