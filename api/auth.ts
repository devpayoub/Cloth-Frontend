import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from "./config";

/** Low-level fetch that forwards the JWT token stored in memory. */
async function authFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, ...rest } = options;
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...(rest.headers as Record<string, string> | undefined),
  };
  if (MEDUSA_PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = MEDUSA_PUBLISHABLE_KEY;
  }
  if (token) {
    headers["authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
    ...rest,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type MedusaCustomer = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
};

export type MedusaAddress = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  address_1: string | null;
  address_2: string | null;
  city: string | null;
  postal_code: string | null;
  country_code: string | null;
  province?: string | null;
  company?: string | null;
  phone: string | null;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
};

// ─── Auth ────────────────────────────────────────────────────────────────────

/** Register a new customer. Returns a JWT token. */
export async function registerCustomer(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<string> {
  let registrationToken: string | undefined;

  try {
    // Step 1: create auth identity and obtain registration token
    const res = await authFetch<{ token: string }>(
      "/auth/customer/emailpass/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    registrationToken = res.token;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (
      msg.toLowerCase().includes("already exists") ||
      msg.toLowerCase().includes("unauthorized")
    ) {
      // Identity already exists. Attempt to sign in or recover orphaned profile
      try {
        const loginToken = await loginCustomer(email, password);
        try {
          await getCustomer(loginToken);
          return loginToken;
        } catch {
          // Identity existed but customer record was missing
          await authFetch("/store/customers", {
            method: "POST",
            token: loginToken,
            body: JSON.stringify({
              email,
              first_name: firstName,
              last_name: lastName,
            }),
          });
          return await loginCustomer(email, password);
        }
      } catch {
        throw new Error(
          "An account with this email already exists. Please sign in."
        );
      }
    }
    throw err;
  }

  // Step 2: create customer profile with the registration token
  try {
    await authFetch("/store/customers", {
      method: "POST",
      token: registrationToken,
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
      }),
    });
  } catch (err: unknown) {
    console.warn("Customer creation warning:", err);
  }

  // Step 3: log in to obtain the authenticated session token with customer_id actor
  return await loginCustomer(email, password);
}

/** Sign in an existing customer. Returns a JWT token. */
export async function loginCustomer(
  email: string,
  password: string
): Promise<string> {
  const { token } = await authFetch<{ token: string }>(
    "/auth/customer/emailpass",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );
  return token;
}

/** Fetch the currently authenticated customer. */
export async function getCustomer(token: string): Promise<MedusaCustomer> {
  const { customer } = await authFetch<{ customer: MedusaCustomer }>(
    "/store/customers/me",
    { token }
  );
  return customer;
}

/** Update name / email / phone. */
export async function updateCustomer(
  token: string,
  data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }
): Promise<MedusaCustomer> {
  const { customer } = await authFetch<{ customer: MedusaCustomer }>(
    "/store/customers/me",
    { method: "POST", token, body: JSON.stringify(data) }
  );
  return customer;
}

/** Change password (requires current password for re-auth then update). */
export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  // Re-authenticate to confirm identity
  await loginCustomer(email, currentPassword);
  await authFetch("/auth/customer/emailpass/update", {
    method: "POST",
    body: JSON.stringify({ email, entity_id: email, password: newPassword }),
  });
}

// ─── Addresses ───────────────────────────────────────────────────────────────

export async function listAddresses(token: string): Promise<MedusaAddress[]> {
  const res = await authFetch<{ addresses?: MedusaAddress[]; customer?: { addresses?: MedusaAddress[] } }>(
    "/store/customers/me/addresses",
    { token }
  );
  return res.addresses ?? res.customer?.addresses ?? [];
}

export async function addAddress(
  token: string,
  data: Omit<MedusaAddress, "id">
): Promise<MedusaAddress | undefined> {
  const res = await authFetch<{ address?: MedusaAddress; customer?: { addresses?: MedusaAddress[] } }>(
    "/store/customers/me/addresses",
    { method: "POST", token, body: JSON.stringify(data) }
  );
  if (res.address) return res.address;
  const addresses = res.customer?.addresses;
  return addresses && addresses.length > 0 ? addresses[addresses.length - 1] : undefined;
}

export async function updateAddress(
  token: string,
  addressId: string,
  data: Partial<Omit<MedusaAddress, "id">>
): Promise<MedusaAddress | undefined> {
  const res = await authFetch<{ address?: MedusaAddress; customer?: { addresses?: MedusaAddress[] } }>(
    `/store/customers/me/addresses/${addressId}`,
    { method: "POST", token, body: JSON.stringify(data) }
  );
  if (res.address) return res.address;
  return res.customer?.addresses?.find((a) => a.id === addressId);
}

export async function deleteAddress(
  token: string,
  addressId: string
): Promise<void> {
  await authFetch(`/store/customers/me/addresses/${addressId}`, {
    method: "DELETE",
    token,
  });
}
