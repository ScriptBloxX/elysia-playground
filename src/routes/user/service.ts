import prisma, { generateAccessToken, generateRefreshToken, generateResetPasswordToken, hash, loadTemplate, sendEmail, validateEmailFormat, validatePassword, validateUsername, verifyResetPasswordToken } from "../../core/Helper";

export async function Create(body: any) {
    validateEmailFormat(body.email);
    validateUsername(body.username);
    validatePassword(body.password);

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: body.email },
                { username: body.username }
            ]
        }
    });
    if (existingUser) {
        if (existingUser.email === body.email) throw new Error("Email is already in use.");
        if (existingUser.username === body.username) throw new Error("Username is already taken.");
    }

    const hashedPassword = await hash(body.password);

    const user = await prisma.user.create({
        data: {
            username: body.username,
            email: body.email,
            password: hashedPassword,
            role: "user",
            isEmailVerified: false,
            profileUrl: 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
            isActive: true,
            isDeleted: false,
            createdBy: body.createdBy || null,
        },
    });

    const accessToken = await generateAccessToken(user.id, user.username, user.role);
    const refreshToken = await generateRefreshToken(user.id)
    await prisma.token.create({
        data: {
            userId: user.id,
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
    });

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        token: accessToken,
        refreshToken: refreshToken,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        profileUrl: user.profileUrl,
    };
}
export async function Read(params: any) {
    const user = await prisma.user.findUnique({
        where: { id: Number(params.id) },
    });
    console.log(user)
    if (!user) throw new Error("User not found")
    return user
}
export async function ReadAll() {
    const result = await prisma.user.findMany();
    return result;
}
export async function Update(req: any) {
    const orConditions: any[] = [];

    if (req.body.username) {
        validateUsername(req.body.username);
        orConditions.push({ username: req.body.username });
    }
    if (req.body.password) validatePassword(req.body.password);
    if (req.body.email) {
        validateEmailFormat(req.body.email);
        orConditions.push({ email: req.body.email });
    }

    const userId = Number(req.user.userId);
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) throw new Error("User not found");
    if (orConditions.length > 0) {
        const existingUser = await prisma.user.findFirst({
            where: {
                AND: [
                    { id: { not: userId } },
                    { OR: orConditions }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email == req.body.email) {
                throw new Error("Email is already in use.");
            }
            if (existingUser.username == req.body.username) {
                throw new Error("Username is already taken.");
            }
        }
    }

    const updatedData: any = {
        username: req.body.username || user.username,
        password: req.body.password ? await hash(req.body.password) : user.password,
        email: req.body.email || user.email,
        profileUrl: req.body.profileUrl || user.profileUrl,
        updatedBy: req.body.updatedBy || user.updatedBy,
    };

    if (req.body.email && req.body.email !== user.email) updatedData.isEmailVerified = false;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updatedData,
    });
    return updatedUser;
}

export async function ForgotPassword(body: any) {
    const user = await prisma.user.findUnique({
        where: { email: body.email },
        select: { id: true, username: true }
    });
    if (!user) throw new Error("User not found");

    const token = await generateResetPasswordToken(user.id, body.email);
    const personalizeTemplate = (template: string, token: string, username: string) => {
        return template
            .replace('{{SERVER_ENDPOINT}}', `${process.env.FRONTEND_EP}/resetpassword?token=${token}`)
            .replace('{{USERNAME}}', username)
            .replace('{{Expires}}', process.env.RP_TOKEN_TIME || 'no limited.')
            .replaceAll('{{COMPANY}}', process.env.COMPANY || '');
    };
    const EmailForm = personalizeTemplate(await loadTemplate('ForgotPassword'), token, user.username);

    await sendEmail(body.email, {
        subject: `${process.env.COMPANY} Reset Password Request`,
        html: EmailForm
    })
    return true;
}
export async function ResetPassword(req: any) {
    const vrpt = await verifyResetPasswordToken(req.body.token);
    validatePassword(req.body.password);
    
    const updatedData: any = {
        password: await hash(req.body.password),
    };

    try {
        const updatedUser = await prisma.user.update({
            where: { id: vrpt.userId },
            data: updatedData,
        });
        return updatedUser;
    } catch (error) {
        throw new Error("User not found");
    }
}

export async function Delete(req: any) {
    await prisma.user.delete({
        where: { id: Number(req.user.id) },
    });

    return { message: `User with id ${req.user.id} deleted successfully` };
}
