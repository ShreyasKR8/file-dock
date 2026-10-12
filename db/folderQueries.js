import { prisma } from "../lib/prisma.js"

export const createFolder = async (folderData) => {
    return prisma.folder.create({
        data: folderData,
    });
};

export const getFolderById = async (folderId, userId) => {
    return prisma.folder.findUnique({
        where: {
            id: folderId,
            userId: userId,
        }
    })
}

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

export const deleteFolderWithFiles = async(folderId, userId) => {
    return prisma.$transaction(async(tx) => {
        const folder = await tx.folder.findFirst({
            where:{
                id: folderId,
                userId,
            }
        });

        if(!folder) {
            throw new Error("Folder not found");
        }

        await tx.file.deleteMany({
            where: { folderId, userId }
        });

        await tx.folder.delete({
            where: { id: folderId }
        });
    });
};