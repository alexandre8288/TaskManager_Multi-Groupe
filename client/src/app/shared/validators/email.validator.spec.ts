import { Email } from './email.validator';

describe('Email', () => {
  it('should create an instance', () => {
    expect(new Email()).toBeTruthy();
  });
});
