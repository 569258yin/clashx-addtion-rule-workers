/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
// const yaml = require('js-yaml');
import yaml from 'js-yaml';

// 订阅地址，返回yaml格式的配置文件
let passwd = '29b3cbba';
let configUrl = '';
let additionRule = [];

/**
 * gatherResponse returns both content-type & response body as a string
 * @param {*} url
 * @returns
 */
async function fetchConfigYaml(url) {
	try {
		// 获取 URL 内容
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const { headers } = response;
		// 将响应转换为 ArrayBuffer
		const arrayBuffer = await response.arrayBuffer();

		// 将 ArrayBuffer 转换为字符串
		const decoder = new TextDecoder('utf-8');
		const yamlString = decoder.decode(arrayBuffer);

		// 解析 YAML 字符串
		const yamlData = yaml.load(yamlString);
		return {headers, yamlData};
	} catch (error) {
		console.error('Error fetching or processing YAML:', error);
		return yaml.load('application/text','fetch error');
	}
}

/**
 * 将additionRule数组中的每一个规则添加到yamlData配置文件中的rules:下
 * @param {*} yamlData
 * @param {*} additionRule
 * @returns
 */
async function addRule(yamlData, additionRule) {
	if (additionRule.length === 0) {
		return yamlData;
	}
	const { rules } = yamlData;
	if (!rules) {
		return yamlData;
	}
	yamlData.rules = [...new Set([...additionRule, ...rules])];
	return yamlData;
}

export default {
	async fetch(request, env, ctx) {
	  	// 获取环境变量
		configUrl = env.configUrl || configUrl;
		if (!configUrl) {
			throw new Error("configUrl is Empty");
		}
		additionRule = env.additionRule || additionRule;
		passwd = env.passwd || passwd;
		if (!passwd) {
			throw new Error('passwd is empty');
		}
		// 鉴定request传参进入的userID是否与配置的一致，否则返回403
		const url = new URL(request.url);
		const params = new URLSearchParams(url.search);
		const requestPasswd = params.get('passwd');
		if (requestPasswd !== passwd) {
			return new Response('Forbidden', { status: 403 });
		}

		// 获取配置文件
		const {headers, yamlData} = await fetchConfigYaml(configUrl);
		// 添加新规则
		const additionRuleYamlData = await addRule(yamlData, additionRule);
		// 将配置文件转换为 YAML 字符串
		const result = yaml.dump(additionRuleYamlData);
		const options = { headers: headers };
		return new Response(result, options);
	},
  };
