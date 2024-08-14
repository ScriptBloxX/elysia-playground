import { PrismaClient } from "@prisma/client";

export async function Create(params:any) {
    return (params)
}
export async function Read() {
    return 'Hello Read'
}
export async function ReadAll() {
    const prisma = new PrismaClient()
    const result = prisma.user.findMany()
    await prisma.$disconnect()

    return result
}
export async function Update() {
    return 'Hello Update'
}
export async function Delete() {
    return 'Hello Delete'
}
