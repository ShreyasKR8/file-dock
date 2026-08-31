import { prisma } from "../lib/prisma.js"

export const createFolder = async (folderData) => {
    return prisma.folder.create({
        data: folderData,
    });
};