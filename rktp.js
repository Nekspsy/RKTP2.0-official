const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

const token = '669148001:AAG2rxvWByTl1Er7PHI78VIdI6gMKvXBPrA';
const logChatId = '-1001247214981';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/cv (.+)/, (msg, match)  => {
	const messageChatId = msg.chat.id;
	const resp = match[1];

			request('https://marketdata.wavesplatform.com/api/ticker/WAVES/USD', function (error, response, body) {
			const data = JSON.parse(body);
			var wavesusd = data['24h_close']

				request('https://www.cbr-xml-daily.ru/daily_json.js', function (error, response, body) {
					const data = JSON.parse(body);
					var usdrub = (data.Valute.USD.Value).toFixed(2);

					request('https://marketdata.wavesplatform.com/api/trades/8LjKWGxXsiLpMziWanFn117e97gNXShD1zwSLCGpSPfb/WAVES/5', function (error, response, body) {
						const data = JSON.parse(body);
						var averagePrice = data.map(i => parseFloat(i['price'])).reduce((a, b) => a + b) / data.length;
						var rktusd = (averagePrice * wavesusd).toFixed(2);
						var rktrub = (rktusd * usdrub).toFixed(2);
						var rkt2usd = (resp * rktusd).toFixed(2);
						var rkt2rub = ((resp * rktusd) * usdrub).toFixed(2);
						
						let md = `
							🚀 RKT8  ➡️  USD/RUB 💵

							1 $ = ${usdrub} ₽
							1 RKT8 = ${rktusd} $ / ${rktrub} ₽

							${resp} RKT8 = ${rkt2usd} $
							${resp} RKT8 = ${rkt2rub} ₽
						`;
	
						bot.sendMessage(messageChatId, md);
						bot.sendMessage(logChatId, 'Пользователь ' + msg.from.first_name + ' (@' + msg.from.username + ') выполнил команду: ' + msg.text );
					})
					
				})

		})

});

bot.on('text', function (msg) {
	const messageChatId = msg.chat.id;
	const messageText = msg.text;

	if (messageText === '/rkt8') {

		request('https://marketdata.wavesplatform.com/api/ticker/WAVES/USD', function (error, response, body) {
			const data = JSON.parse(body);
			var wavesusd = data['24h_close']

			request('https://matcher.wavesplatform.com/matcher/orderbook/8LjKWGxXsiLpMziWanFn117e97gNXShD1zwSLCGpSPfb/WAVES', function (error, response, body) {
				const data = JSON.parse(body);
				var lastbid = (data.bids[0].price / 100000000).toFixed(8);
				var lastask = (data.asks[0].price / 100000000).toFixed(8);

				request('https://marketdata.wavesplatform.com/api/trades/8LjKWGxXsiLpMziWanFn117e97gNXShD1zwSLCGpSPfb/WAVES/5', function (error, response, body) {
					const data = JSON.parse(body);
					var averagePrice = data.map(i => parseFloat(i['price'])).reduce((a, b) => a + b) / data.length;
					var rktusd = (averagePrice * wavesusd).toFixed(2);
	
					let md = `
						🚀  RKT8  /  WAVES  🔹

						Покупка: ${lastbid}
						Продажа: ${lastask}
						Цена в usd: ${rktusd}
							`;
					bot.sendMessage(messageChatId, md);
					bot.sendMessage(logChatId, 'Пользователь ' + msg.from.first_name + ' (@' + msg.from.username + ') выполнил команду: ' + msg.text );
				})

			})

		})

	}	else if (messageText === '/waves') {

		request('https://matcher.wavesplatform.com/matcher/orderbook/WAVES/Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck', function(error, response, body) {
			const data = JSON.parse(body);
			var lastbid = (data.bids[0].price)/100;
			var lastask = (data.asks[0].price)/100;

			let md = `
				🔹  WAVES  /  USD  💲

				Покупка: ${lastbid}
				Продажа: ${lastask}
			`;
			bot.sendMessage(messageChatId, md);
			bot.sendMessage(logChatId, 'Пользователь ' + msg.from.first_name + ' (@' + msg.from.username + ') выполнил команду: ' + msg.text );
		})

	}

});    
