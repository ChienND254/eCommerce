import JWT, { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
    userId: any;
    email: String
}

const createTokenPair = async (
    payload: TokenPayload,
    publicKey: string,
    privateKey: string
): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const accessTokenOptions: SignOptions = {
            expiresIn: '2 days'
        };

        const refreshTokenOptions: SignOptions = {
            expiresIn: '7 days'
        };

        const accessToken:string = JWT.sign(payload, publicKey, accessTokenOptions);

        const refreshToken:string = JWT.sign(payload, privateKey, refreshTokenOptions);

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error verify::', err);
            } else {
                console.log('decode verify::', decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

export { createTokenPair };
