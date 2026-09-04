import { prisma } from "../lib/prisma.js"

export const createFolder = async (folderData) => {
    return prisma.folder.create({
        data: folderData,
    });
};

export const getFolders = async (userId) => {
    const folders = await prisma.folder.findMany({
        where: {
            userId: userId,
        }
    });

    return folders;
}
