// taxlator/src/api/types.ts
export type SignUpPayload = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export type SignInPayload = {
	email: string;
	password: string;
};

// Tax API
export type TaxType = "PAYE/PIT" | "FREELANCER" | "CIT";
export type Frequency = "monthly" | "annual";
export type CompanySize = "SMALL" | "MEDIUM" | "LARGE";

// PAYE/PIT request (what your Joi expects)
export type PayePitCalculatePayload = {
	taxType: "PAYE/PIT";
	grossIncome: number;
	frequency?: "monthly" | "annual";
	rentRelief?: number;
	otherDeductions?: number;
};

// Freelancer request
export type FreelancerCalculatePayload = {
	taxType: "FREELANCER";
	grossIncome: number;
	frequency?: Frequency;
	expenses?: number;
	pension?: number;
};

// CIT request
export type CitCalculatePayload = {
	taxType: "CIT";
	revenue: number;
	companySize: CompanySize;
	expenses?: number;
	frequency?: Frequency;
};

// VAT request
export type VatCalculationType = "add" | "remove";
export type VatTransactionType =
	| "Domestic sale/Purchase"
	| "Digital Services"
	| "Export/International"
	| "Exempt";

export type VatCalculatePayload = {
	transactionAmount: number;
	calculationType: VatCalculationType;
	transactionType: VatTransactionType;
};

// Union payload (one of the above)
export type TaxCalculatePayload =
	| PayePitCalculatePayload
	| FreelancerCalculatePayload
	| CitCalculatePayload;

// JSON-safe helper types (avoid `any`)
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
	| JsonPrimitive
	| JsonValue[]
	| { [key: string]: JsonValue };

// History item type
export type HistoryItem = {
	_id?: string; // MongoDB ID
	type: "PAYE/PIT" | "FREELANCER" | "CIT" | "VAT";
	input: Record<string, unknown>; // store the payload used
	result: Record<string, unknown>; // store the calculation result
	createdAt: string | Date;
};

// Upstream responses vary; keep flexible but lint-safe
export type AnyJson = Record<string, unknown>;
