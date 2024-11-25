import { PrismaClient } from "@prisma/client";
import { validateEmailFormat } from "../../core/Helper";

export async function Create(params:any) {
    console.log(params)
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
