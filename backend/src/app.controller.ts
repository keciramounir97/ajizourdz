import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service.js";
import { BookingStatus, Category, CurrencyOption } from "./types.js";

@Controller("api")
export class AppController {
  constructor(@Inject(AppService) private readonly app: AppService) {}

  @Get()
  apiRoot() {
    return { name: "Ajizour Tourism API", status: "running" };
  }

  @Get("health")
  health() {
    return this.app.health();
  }

  @Post("auth/signup")
  signup(@Body() body: { name: string; email: string; password: string }) {
    return this.app.signup(body);
  }

  @Post("auth/login")
  login(@Body() body: { email: string; password: string }) {
    return this.app.login(body);
  }

  @Post("auth/refresh")
  refresh() {
    return { ok: true, message: "Refresh token endpoint is ready." };
  }

  @Post("auth/logout")
  logout() {
    return { ok: true };
  }

  @Post("auth/reset-password")
  resetPassword(@Body() body: { email: string }) {
    return this.app.resetPassword(body);
  }

  @Post("auth/reset-password/confirm")
  confirmResetPassword(@Body() body: { token: string; password: string }) {
    return this.app.confirmResetPassword(body);
  }

  @Get("facilities")
  facilities(
    @Query("category") category?: Category,
    @Query("wilaya") wilaya?: string,
    @Query("budget") budget?: string,
    @Query("providerType") providerType?: string,
    @Query("q") q?: string,
    @Query("sort") sort?: string,
  ) {
    return this.app.listFacilities({ category, wilaya, budget, providerType, q, sort });
  }

  @Get("facilities/:id")
  facility(@Param("id") id: string) {
    return this.app.getFacility(id);
  }

  @Get("bookings/me")
  bookings(@Query("userId") userId?: string) {
    return this.app.listBookings(userId);
  }

  @Post("bookings")
  createBooking(@Body() body: Parameters<AppService["createBooking"]>[0]) {
    return this.app.createBooking(body);
  }

  @Patch("bookings/:id/status")
  updateBookingStatus(@Param("id") id: string, @Body() body: { status: BookingStatus }) {
    return this.app.updateBookingStatus(id, body.status);
  }

  @Get("activity-context")
  activityContext(@Query("userId") userId?: string) {
    return this.app.getActivityContext(userId);
  }

  @Post("activity-context")
  addActivityContext(@Body() body: { userId?: string; facilityId: string }) {
    return this.app.addActivityContext(body.userId, body.facilityId);
  }

  @Delete("activity-context/:facilityId")
  removeActivityContext(@Param("facilityId") facilityId: string, @Query("userId") userId?: string) {
    return this.app.removeActivityContext(userId, facilityId);
  }

  @Post("smart-plans/generate")
  smartPlan(@Body() body: Parameters<AppService["generatePlan"]>[0]) {
    return this.app.generatePlan(body);
  }

  @Get("currencies")
  currencies() {
    return this.app.listCurrencies();
  }

  @Post("currencies")
  upsertCurrency(@Body() body: CurrencyOption) {
    return this.app.upsertCurrency(body);
  }

  @Post("contact")
  contact(@Body() body: Parameters<AppService["createContact"]>[0]) {
    return this.app.createContact(body);
  }

  @Get("admin")
  admin() {
    return this.app.adminSummary();
  }
}
