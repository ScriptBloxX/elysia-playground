import { PrismaClient } from "@prisma/client";
import { validateEmailFormat, validatePassword, validateUsername } from "../../core/Helper";

export async function Create(body:any) {
    validateEmailFormat(body.email);
    validateUsername(body.username);
    validatePassword(body.password);
    return (body)
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
