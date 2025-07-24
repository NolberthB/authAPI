export default {
  testEnvironment: 'node',
  transform: {}, // Necesario con ESM para evitar errores con Babel
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Opcional si quieres configurar cosas globales como timeout
  testMatch: ['**/tests/**/*.test.js']
}
