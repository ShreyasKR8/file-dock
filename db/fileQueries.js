import { prisma } from "../lib/prisma.js";

export const createFile = async (fileData) => {
    return prisma.file.create({
        data: fileData,
    })
};
