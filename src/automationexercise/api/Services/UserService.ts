import { APIResponse } from '@playwright/test';
import { Routes } from '@constants/Routes';
import { User } from '@models/UserModels';
import { ApiClient } from '../ApiClient';

export class UserService extends ApiClient {
    private toAccountForm(user: User): Record<string, string> {
        return {
            address1: user.address1,
            address2: user.address2 || '',
            birth_date: user.birthDay,
            birth_month: user.birthMonth,
            birth_year: user.birthYear,
            city: user.city,
            company: user.company,
            country: user.country,
            email: user.email,
            firstname: user.firstName,
            lastname: user.lastName,
            mobile_number: user.mobileNumber,
            name: user.name,
            password: user.password,
            state: user.state,
            title: user.title,
            zipcode: user.zipcode,
        };
    }

    async createAccount(user: User): Promise<APIResponse> {
        return this.post(Routes.API.CREATE_ACCOUNT, { form: this.toAccountForm(user) });
    }

    async verifyLogin(email: string, password: string): Promise<APIResponse> {
        return this.post(Routes.API.VERIFY_LOGIN, { form: { email, password } });
    }

    async verifyLoginWithoutEmail(password: string): Promise<APIResponse> {
        return this.post(Routes.API.VERIFY_LOGIN, { form: { password } });
    }

    async deleteAccount(email: string, password: string): Promise<APIResponse> {
        return this.delete(Routes.API.DELETE_ACCOUNT, { form: { email, password } });
    }

    async updateAccount(user: User): Promise<APIResponse> {
        return this.put(Routes.API.UPDATE_ACCOUNT, { form: this.toAccountForm(user) });
    }

    async getUserDetailByEmail(email: string): Promise<APIResponse> {
        return this.get(Routes.API.GET_USER_DETAIL_BY_EMAIL, { params: { email } });
    }

    async deleteVerifyLogin(): Promise<APIResponse> {
        return this.delete(Routes.API.VERIFY_LOGIN);
    }
}