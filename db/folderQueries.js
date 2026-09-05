import { prisma } from "../lib/prisma.js"

export const createFolder = async (folderData) => {
    return prisma.folder.create({
        data: folderData,
    });
};

export const getFoldersByUser = async (userId) => {
    const folders = await prisma.folder.findMany({
        where: {
            userId: userId,
        }
    });

    return folders;
}

export const updateFolderName =
    async (folderId, userId, newName) => {
        return prisma.folder.update({
            where: {
                id: folderId,
                userId,
            },
            data: {
                name: newName,
            },
        });
    }
    
export const deleteFolderByUser = async (folderId, userId) => {
    await prisma.folder.delete({
        where: {
            id: folderId,
            userId,
        }
    });
};