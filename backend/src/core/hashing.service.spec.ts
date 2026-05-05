import { HashingService } from './hashing.service';
import * as bcrypt from 'bcrypt';

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(() => {
    service = new HashingService();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should generate a valid bcrypt hash', async () => {
      const password = 'testPassword';
      const hash = await service.hash(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      // bcrypt hashes typically start with $2a$, $2b$ or $2y$
      expect(hash.startsWith('$2')).toBe(true);
    });

    it('should call bcrypt.hash with the correct salt rounds', async () => {
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');
      const password = 'testPassword';
      await service.hash(password);

      expect(bcryptHashSpy).toHaveBeenCalledWith(password, 10);
      bcryptHashSpy.mockRestore();
    });
  });

  describe('compare', () => {
    it('should return true if password matches hash', async () => {
      const password = 'testPassword';
      const hash = await bcrypt.hash(password, 10);

      const result = await service.compare(password, hash);
      expect(result).toBe(true);
    });

    it('should return false if password does not match hash', async () => {
      const password = 'testPassword';
      const wrongPassword = 'wrongPassword';
      const hash = await bcrypt.hash(password, 10);

      const result = await service.compare(wrongPassword, hash);
      expect(result).toBe(false);
    });

    it('should call bcrypt.compare with correct arguments', async () => {
      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');
      const password = 'testPassword';
      const hash = 'someHash';

      await service.compare(password, hash);

      expect(bcryptCompareSpy).toHaveBeenCalledWith(password, hash);
      bcryptCompareSpy.mockRestore();
    });
  });
});
