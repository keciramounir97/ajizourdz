var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service.js";
let AppController = class AppController {
    app;
    constructor(app) {
        this.app = app;
    }
    apiRoot() {
        return { name: "Ajizour Tourism API", status: "running" };
    }
    health() {
        return this.app.health();
    }
    signup(body) {
        return this.app.signup(body);
    }
    login(body) {
        return this.app.login(body);
    }
    refresh() {
        return { ok: true, message: "Refresh token endpoint is ready." };
    }
    logout() {
        return { ok: true };
    }
    resetPassword(body) {
        return this.app.resetPassword(body);
    }
    confirmResetPassword(body) {
        return this.app.confirmResetPassword(body);
    }
    facilities(category, wilaya, budget, providerType, q, sort) {
        return this.app.listFacilities({ category, wilaya, budget, providerType, q, sort });
    }
    facility(id) {
        return this.app.getFacility(id);
    }
    bookings(userId) {
        return this.app.listBookings(userId);
    }
    createBooking(body) {
        return this.app.createBooking(body);
    }
    updateBookingStatus(id, body) {
        return this.app.updateBookingStatus(id, body.status);
    }
    activityContext(userId) {
        return this.app.getActivityContext(userId);
    }
    addActivityContext(body) {
        return this.app.addActivityContext(body.userId, body.facilityId);
    }
    removeActivityContext(facilityId, userId) {
        return this.app.removeActivityContext(userId, facilityId);
    }
    smartPlan(body) {
        return this.app.generatePlan(body);
    }
    currencies() {
        return this.app.listCurrencies();
    }
    upsertCurrency(body) {
        return this.app.upsertCurrency(body);
    }
    contact(body) {
        return this.app.createContact(body);
    }
    admin() {
        return this.app.adminSummary();
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "apiRoot", null);
__decorate([
    Get("health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "health", null);
__decorate([
    Post("auth/signup"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "signup", null);
__decorate([
    Post("auth/login"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "login", null);
__decorate([
    Post("auth/refresh"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "refresh", null);
__decorate([
    Post("auth/logout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "logout", null);
__decorate([
    Post("auth/reset-password"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "resetPassword", null);
__decorate([
    Post("auth/reset-password/confirm"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "confirmResetPassword", null);
__decorate([
    Get("facilities"),
    __param(0, Query("category")),
    __param(1, Query("wilaya")),
    __param(2, Query("budget")),
    __param(3, Query("providerType")),
    __param(4, Query("q")),
    __param(5, Query("sort")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "facilities", null);
__decorate([
    Get("facilities/:id"),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "facility", null);
__decorate([
    Get("bookings/me"),
    __param(0, Query("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "bookings", null);
__decorate([
    Post("bookings"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createBooking", null);
__decorate([
    Patch("bookings/:id/status"),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateBookingStatus", null);
__decorate([
    Get("activity-context"),
    __param(0, Query("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "activityContext", null);
__decorate([
    Post("activity-context"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "addActivityContext", null);
__decorate([
    Delete("activity-context/:facilityId"),
    __param(0, Param("facilityId")),
    __param(1, Query("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "removeActivityContext", null);
__decorate([
    Post("smart-plans/generate"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "smartPlan", null);
__decorate([
    Get("currencies"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "currencies", null);
__decorate([
    Post("currencies"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "upsertCurrency", null);
__decorate([
    Post("contact"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "contact", null);
__decorate([
    Get("admin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "admin", null);
AppController = __decorate([
    Controller("api"),
    __param(0, Inject(AppService)),
    __metadata("design:paramtypes", [AppService])
], AppController);
export { AppController };
