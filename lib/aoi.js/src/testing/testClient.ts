import AoiClient from '@aoi.js/classes/AoiClient.js';
import { ReturnType } from '@aoi.js/typings/enum.js';

class TestClient extends AoiClient {
	constructor() {
		super({ testMode: true, token: 'token.a.b', 'intents': 0, prefix: '.', events: [] });
	// code...
	}

	parseData(output: string, type: ReturnType) {
		if (output === '') return output;
		
		switch (type) {
			case ReturnType.String: return output;
			case ReturnType.Number: return Number(output);
			case ReturnType.Boolean: return output === 'true';
			case ReturnType.Object: return JSON.parse(output) as Record<string, unknown>;
			case ReturnType.Array: return JSON.parse(output) as unknown[];
			default: return output;
		}
	} 
}

export default TestClient;