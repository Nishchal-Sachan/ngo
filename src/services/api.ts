const API_BASE = "/api";

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export async function postVolunteer(data: Record<string, unknown>): Promise<ApiResponse<unknown>> {
  const res = await fetch(`${API_BASE}/volunteer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  keyId: string;
}

export async function createPaymentOrder(data: {
  name: string;
  email?: string;
  phone: string;
  amount: number;
  pan: string;
}): Promise<ApiResponse<CreateOrderResponse>> {
  const res = await fetch(`${API_BASE}/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export interface VerifyPaymentResponse {
  receiptNumber: string;
  amount: number;
  name: string;
  id?: string;
}

export async function verifyPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  receipt: string;
  name: string;
  email?: string;
  phone: string;
  pan: string;
}): Promise<ApiResponse<VerifyPaymentResponse>> {
  const res = await fetch(`${API_BASE}/payment/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function getDashboardStats(): Promise<
  ApiResponse<{
    totalDonations: number;
    donationCount: number;
    totalVolunteers: number;
    activeCampaigns: number;
    monthlyDonations: { month: string; amount: number; count: number }[];
  }>
> {
  const res = await fetch(`${API_BASE}/admin/dashboard/stats`, {
    credentials: "include",
  });
  return res.json();
}

export async function getVolunteers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  occupation?: string;
}): Promise<ApiResponse<PaginatedResponse<unknown>>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.occupation) searchParams.set("occupation", params.occupation);
  const qs = searchParams.toString();
  const res = await fetch(`${API_BASE}/admin/volunteers${qs ? `?${qs}` : ""}`, {
    credentials: "include",
  });
  return res.json();
}

export async function getCampaigns(params?: {
  status?: string;
}): Promise<ApiResponse<CampaignItem[]>> {
  const qs = params?.status ? `?status=${params.status}` : "";
  const res = await fetch(`${API_BASE}/campaign${qs}`);
  return res.json();
}

export interface CampaignItem {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  createdAt: string;
}

export async function getAdminCampaigns(params?: {
  status?: string;
}): Promise<ApiResponse<CampaignItem[]>> {
  const qs = params?.status ? `?status=${params.status}` : "";
  const res = await fetch(`${API_BASE}/admin/campaigns${qs}`, {
    credentials: "include",
  });
  return res.json();
}

export async function getCampaign(id: string): Promise<ApiResponse<CampaignItem>> {
  const res = await fetch(`${API_BASE}/admin/campaigns/${id}`, {
    credentials: "include",
  });
  return res.json();
}

export async function createCampaign(data: Record<string, unknown>): Promise<
  ApiResponse<{ id: string; title: string; status: string }>
> {
  const res = await fetch(`${API_BASE}/admin/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCampaign(
  id: string,
  data: Record<string, unknown>
): Promise<ApiResponse<{ id: string; title: string; status: string }>> {
  const res = await fetch(`${API_BASE}/admin/campaigns/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCampaign(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  const res = await fetch(`${API_BASE}/admin/campaigns/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  heroImage?: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
}

export async function getHeroContent(): Promise<ApiResponse<HeroContent | null>> {
  const res = await fetch(`${API_BASE}/content/hero`);
  return res.json();
}

export interface AboutContentData {
  aboutText: string;
  visionText: string;
  missionText: string;
  objectives: string[];
}

export async function getAboutContent(): Promise<ApiResponse<AboutContentData | null>> {
  const res = await fetch(`${API_BASE}/content/about`);
  return res.json();
}

export async function updateAboutContent(
  data: Partial<AboutContentData>
): Promise<ApiResponse<AboutContentData>> {
  const res = await fetch(`${API_BASE}/admin/content/about`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export interface LegalInfoData {
  registrationNumber: string;
  registeredUnder: string;
  is80GCompliant: boolean;
  is12ACompliant: boolean;
  status: string;
}

export async function getLegalInfo(): Promise<ApiResponse<LegalInfoData | null>> {
  const res = await fetch(`${API_BASE}/content/legal`);
  return res.json();
}

export async function updateLegalInfo(
  data: Partial<LegalInfoData>
): Promise<ApiResponse<LegalInfoData>> {
  const res = await fetch(`${API_BASE}/admin/content/legal`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export interface BankDetailsData {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  contactEmail: string;
}

export async function getBankDetails(): Promise<ApiResponse<BankDetailsData | null>> {
  const res = await fetch(`${API_BASE}/content/bank`);
  return res.json();
}

export async function updateBankDetails(
  data: Partial<BankDetailsData>
): Promise<ApiResponse<BankDetailsData>> {
  const res = await fetch(`${API_BASE}/admin/content/bank`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export interface BoardMemberItem {
  id: string;
  name: string;
  designation: string;
  order: number;
}

export async function getBoardMembers(): Promise<ApiResponse<BoardMemberItem[]>> {
  const res = await fetch(`${API_BASE}/content/board`);
  return res.json();
}

export async function createBoardMember(data: {
  name: string;
  designation: string;
  order?: number;
}): Promise<ApiResponse<BoardMemberItem>> {
  const res = await fetch(`${API_BASE}/admin/board`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBoardMember(
  id: string,
  data: Partial<{ name: string; designation: string; order: number }>
): Promise<ApiResponse<BoardMemberItem>> {
  const res = await fetch(`${API_BASE}/admin/board/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteBoardMember(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  const res = await fetch(`${API_BASE}/admin/board/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}

export async function updateHeroContent(data: Partial<HeroContent> & { image?: File }): Promise<ApiResponse<HeroContent>> {
  if (data.image) {
    const formData = new FormData();
    formData.append("heroImage", data.image);
    if (data.title != null) formData.append("title", data.title);
    if (data.subtitle != null) formData.append("subtitle", data.subtitle);
    if (data.description != null) formData.append("description", data.description);
    if (data.imageUrl != null) formData.append("imageUrl", data.imageUrl);
    if (data.ctaPrimaryText != null) formData.append("ctaPrimaryText", data.ctaPrimaryText);
    if (data.ctaSecondaryText != null) formData.append("ctaSecondaryText", data.ctaSecondaryText);
    const res = await fetch(`${API_BASE}/admin/content/hero`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    return res.json();
  }
  const res = await fetch(`${API_BASE}/admin/content/hero`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getReports(): Promise<
  ApiResponse<{ id: string; title: string; year: number; fileUrl: string; fileName: string; fileSize: number; createdAt: string }[]>
> {
  const res = await fetch(`${API_BASE}/reports`);
  return res.json();
}

export async function getAdminReports(): Promise<
  ApiResponse<{ id: string; title: string; year: number; fileUrl: string; fileName: string; fileSize: number; createdAt: string }[]>
> {
  const res = await fetch(`${API_BASE}/admin/reports`, {
    credentials: "include",
  });
  return res.json();
}

export async function uploadReport(file: File): Promise<
  ApiResponse<{ url: string; publicId: string; fileName: string; fileSize: number }>
> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/admin/reports/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return res.json();
}

export async function createReport(data: {
  title: string;
  year: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  publicId: string;
}): Promise<ApiResponse<{ id: string; title: string; year: number }>> {
  const res = await fetch(`${API_BASE}/admin/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteReport(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  const res = await fetch(`${API_BASE}/admin/reports/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}

export async function uploadImage(file: File): Promise<
  ApiResponse<{ url: string; publicId: string }>
> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return res.json();
}

export async function getDonations(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse<PaginatedResponse<unknown>>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);
  const qs = searchParams.toString();
  const res = await fetch(`${API_BASE}/admin/donations${qs ? `?${qs}` : ""}`, {
    credentials: "include",
  });
  return res.json();
}

export interface LoginResponse {
  user: { id: string; email: string; name: string };
}

export async function login(
  email: string,
  password: string
): Promise<ApiResponse<LoginResponse>> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
