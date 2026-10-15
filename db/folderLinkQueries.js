import { prisma } from "../lib/prisma.js";

export const getSharedFolderByTokenHash = async (tokenHash)=> {
    return prisma.folderShareLink.findFirst({
        where: { tokenHash },
        include: {
            folder: true,
        },
    });
}
