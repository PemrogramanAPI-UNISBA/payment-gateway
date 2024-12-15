export const ENV = {
	MODE: process.env.NEXT_PUBLIC_MODE,
	TOKEN_KEY: process.env.TOKEN_KEY || 'secret',
	JWT_SECRET: process.env.JWT_SECRET,
	URI: {
		BASE_URL: 'http://localhost:3000',
	},
};
