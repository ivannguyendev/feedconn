# Feedconn
Library create message feeds that provides quickly and easily.

On August 1, 2022, the messaging application Zalo will launch premium features that is not free. To keeping in touch with own customer that cause my Team run chat feature on own app. So that, message feeds required to operate efficiently, timely and accurately. The Feedconn will be the core library of the message feeds system.

## Installation
Installation is done using the [npm install command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):
```bash
npm install @whthduck/feedconn
```

Or using the [yarn add command](https://yarnpkg.com/cli/add)
```bash
yarn add @whthduck/feedconn
```

## Quick start
The quickest way is started with [expressjs](http://expressjs.com/en/starter/installing.html)  . If you haven't seen let's follow  [installing guide ](http://expressjs.com/en/starter/installing.html)

Create /cert folder => copy credentials from firebase => paste into /cert folder. If you haven't before or how to get it, follow the instructions [Service Account](https://firebase.google.com/support/guides/service-accounts)

After that, use middleware like the source code below or follow the [example](https://github.com/whthduck/feedconn/tree/main/example)
``` javascript
const feedconnApp = new Feedconn().loadByConfig({
	app: 'app',
	credential: {
		...credential,
		projectId: credential['projectId'] || credential.project_id,
		privateKey: credential['privateKey'] || credential.private_key,
		clientEmail: credential['clientEmail'] || credential.client_email,
	},
	databaseURL: database.url,
});
```

## TODO
✅ Implement [nestjs-feedconn](https://github.com/whthduck/nestjs-feedconn) module
✅ insert message into firebase database
✔️ interactive message
✔️ validate content message

## Thank you
- [OneSignal](https://onesignal.com/)  is the fastest and most reliable service to send push notifications, in-app messages, SMS, and emails.

## License
[MIT](https://github.com/whthduck/flaword/blob/main/LICENSE)