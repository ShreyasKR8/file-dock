import { prisma } from "../lib/prisma.js";

export const createFile = async (fileData) => {
    return prisma.file.create({
        data: fileData,
    })
};

export const getFilesInRoot = async () => {
    return prisma.file.findMany({
        where: {
            folderId: null,
        }
    });
}
