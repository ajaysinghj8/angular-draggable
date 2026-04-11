import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
setupZoneTestEnv();

// JSDOM does not implement document.elementsFromPoint — define a stub so
// tests can spy on it and the service doesn't throw at runtime.
Object.defineProperty(document, 'elementsFromPoint', {
  value: jest.fn().mockReturnValue([]),
  writable: true,
  configurable: true,
});
