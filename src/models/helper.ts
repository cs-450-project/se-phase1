// ESM syntax is supported.

import { Octokit } from '@octokit/rest';

import dotenv from "dotenv";
dotenv.config();

const token = process.env.GITHUB_TOKEN;

    if (!token) {
    throw new Error("GitHub token not found");
    }

    const octokit = new Octokit({
    auth: token,
    });

export async function helper() {
    
    try {
        const response = await octokit.rest.repos.get({
        owner: "cloudinary",
        repo: "cloudinary_npm",
        });
        console.log("Repository:", response.data.full_name);
    } catch {
        console.error("Error fetching repository data");
    }

    const getData = async () => {
    try {
        const { data } = await octokit.rest.users.getAuthenticated();
        const { login } = data;
        console.log("Authenticated user login:", login); 
    } catch (error) {
        console.error("Error fetching authenticated user data:", error);
        if ((error as any).response) {
        console.error("Status:", (error as any).response.status);
        console.error("Headers:", (error as any).response.headers);
        console.error("Data:", (error as any).response.data);
        }
    }
    };

    getData();
}
