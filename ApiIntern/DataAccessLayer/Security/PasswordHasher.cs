using System.Security.Cryptography;


namespace DataAccessLayer.Services.Security
    {
        public class PasswordHasher
        {
            private const int Iterations = 100000;
            private const int KeySize = 32;       // derived key length in bytes (256-bit)

        public static string Hash(string password)
            {
                using var rng = RandomNumberGenerator.Create();
                var salt = new byte[16];
                rng.GetBytes(salt);   // unique, cryptographically-strong salt 

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
                var key = pbkdf2.GetBytes(KeySize);   // the slow, derived key

            return $"{Iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(key)}";
            }

            public static bool Verify(string password, string hash)
            {
                if (string.IsNullOrWhiteSpace(hash)) return false;

                var parts = hash.Split('.', 3, StringSplitOptions.TrimEntries);
                if (parts.Length != 3) return false;
                if (!int.TryParse(parts[0], out var iterations) || iterations <= 0) return false;

                byte[] salt, key;
                try
                {
                    salt = Convert.FromBase64String(parts[1]);
                    key = Convert.FromBase64String(parts[2]);
                }
                catch (FormatException)
                {
                    return false;
                }

                using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);
                var keyToCheck = pbkdf2.GetBytes(KeySize);
                return CryptographicOperations.FixedTimeEquals(key, keyToCheck);
            }
        }
    }