// DOC: "https://appwrite.io/docs/products/auth/email-password"

import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(), // Method from Appwrite to generate a unique ID for the user
                email,
                password,
                name
            );

            if (userAccount) {
                // Call Login method to log the user in after account creation.
                return this.login({ email, password });
            } else {
                console.error("Account creation failed:", userAccount);
            }

        } catch (error) {
            console.error("Error creating account:", error);
            throw error;
        }
    }

    async login({ email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error){
            console.error("Error fetching current user:", error);
            throw error;
        }
    }

    async logout () {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }
}

const AuthService = new AuthService();

export default AuthService;