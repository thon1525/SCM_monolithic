import dotenv from 'dotenv';
import { getConfig } from '../configs';
import { ApiError } from '@scm/errors/api-error';

// Mocking dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('getConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clears any cache between tests.
    process.env = { ...originalEnv }; // Reset process.env to original values
  });

  afterEach(() => {
    process.env = originalEnv; // Restore the original environment
  });

  it('should throw an error if required environment variables are missing', () => {
    (dotenv.config as jest.Mock).mockReturnValue({ parsed: {} });

    const requiredConfig = ["NODE_ENV", "PORT", "MONGODB_URL", "LOG_LEVEL"];
    requiredConfig.forEach((key) => {
      delete process.env[key];
    });

    expect(() => getConfig('development')).toThrow(
      new ApiError(`Missing required environment variables: ${requiredConfig.join(", ")}`)
    );
  });

  it('should return configuration object if all required environment variables are present', () => {
    process.env.NODE_ENV = 'development';
    process.env.PORT = '3000';
    process.env.MONGODB_URL = 'mongodb://localhost:27017';
    process.env.LOG_LEVEL = 'debug';

    (dotenv.config as jest.Mock).mockReturnValue({ parsed: process.env });

    const config = getConfig('development');
    expect(config).toEqual({
      env: 'development',
      port: '3000',
      mongoUrl: 'mongodb://localhost:27017',
      logLevel: 'debug',
    });
  });
});
