import { prisma } from "../lib/prisma.js";

export const getUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
    });
}

export const getUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email },
    });
};

export const createUser = async (userData) => {
    return prisma.user.create({
        data: userData,
    });
};
