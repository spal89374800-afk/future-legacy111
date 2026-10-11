const SHARED_SECRET_SALT = "spal_89374800_secure_salt_v1_99";
const MAIN_MASTER_UPI = "spal89374800@okaxis";

// Checksum Signature Generator to prevent local storage injection / tampering
export function generateUPISignature(upi: string): string {
  const normalized = upi.trim().toLowerCase();
  let hash = 0;
  const word = normalized + SHARED_SECRET_SALT;
  for (let i = 0; i < word.length; i++) {
    const char = word.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36) + "x" + normalized.length;
}

// Securely Fetch Merchant UPI - reverts to owner master on tampering
export function getSecureMerchantUPI(): string {
  try {
    const rawUpi = localStorage.getItem('merchant_upi_id');
    const rawSig = localStorage.getItem('merchant_upi_signature');

    if (!rawUpi) {
      // First-time load: initialize with signed master
      saveSecureMerchantUPI(MAIN_MASTER_UPI);
      return MAIN_MASTER_UPI;
    }

    const normUpi = rawUpi.trim();
    const expectedSig = generateUPISignature(normUpi);

    if (rawSig !== expectedSig) {
      console.warn("🔐 SECURITY ALERT: Stored UPI has been manually tampered! Automatically recovering to master secure address.");
      saveSecureMerchantUPI(MAIN_MASTER_UPI);
      return MAIN_MASTER_UPI;
    }

    return normUpi;
  } catch (err) {
    console.error("Secure UPI retrieval error:", err);
    return MAIN_MASTER_UPI;
  }
}

// Securely Update Merchant UPI & Write valid Signature
export function saveSecureMerchantUPI(upi: string): void {
  const normUpi = upi.trim();
  const sig = generateUPISignature(normUpi);
  localStorage.setItem('merchant_upi_id', normUpi);
  localStorage.setItem('merchant_upi_signature', sig);
}

// Simple Admin Verification Key Check
export function verifyAdminAccessPin(pin: string): boolean {
  // Configured Master Admin PIN - change as required by owner
  const MASTER_ADMIN_PINS = ['8937', '893748', '74800'];
  return MASTER_ADMIN_PINS.includes(pin.trim());
}
