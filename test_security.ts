// test_security.ts
const BASE_URL = "https://mcdhd-mcdtu-2026-symposium-tezu.vercel.app/"; // 👈 points to your active local dev server

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runSecurityAudit() {
  console.log(`\nStarting Security Audit against: ${BASE_URL}\n`);

  // 1. Test Admin Route Protection
  console.log("--- [1] Admin Route Unauthorized Block Test ---");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/delegate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: "fake-id", newStatus: "COMPLETED" }),
    });

    if (res.status === 401) {
      console.log("✅ PASS: Blocked unauthenticated admin request with HTTP 401 Unauthorized.");
    } else {
      console.log(`❌ FAILED: Unexpected status code returned: ${res.status}`);
    }
  } catch (err: any) {
    console.log(`⚠️ Connection Error: ${err.message}`);
  }

  // 2. Test Admin Login Brute-Force Rate Limiting
  console.log("\n--- [2] Admin Login Brute-Force Throttling Test (Limit: 5) ---");
  for (let i = 1; i <= 7; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "attacker", password: "wrongpassword" }),
      });

      console.log(`  Attempt ${i}: HTTP Status ${res.status}`);
      if (res.status === 429) {
        console.log("✅ PASS: Rate limiter activated (429 Too Many Requests)!");
        break;
      }
    } catch (err: any) {
      console.log(`  Attempt ${i} failed: ${err.message}`);
    }
    await sleep(200);
  }

  // 3. Test Global Security Headers
  console.log("\n--- [3] Security Headers Audit ---");
  try {
    const res = await fetch(`${BASE_URL}/`);
    const headers = res.headers;

    const xFrame = headers.get("x-frame-options");
    const xContentType = headers.get("x-content-type-options");
    const hsts = headers.get("strict-transport-security");

    console.log(`  X-Frame-Options: ${xFrame ? `✅ (${xFrame})` : "❌ (MISSING)"}`);
    console.log(`  X-Content-Type-Options: ${xContentType ? `✅ (${xContentType})` : "❌ (MISSING)"}`);
    console.log(`  Strict-Transport-Security: ${hsts ? `✅ (${hsts})` : "ℹ️ (HSTS only applies over HTTPS/Production)"}`);
  } catch (err: any) {
    console.log(`Header check error: ${err.message}`);
  }
  
  console.log("\nAudit complete.\n");
}

runSecurityAudit();