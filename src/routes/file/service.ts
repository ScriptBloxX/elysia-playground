import { fileUpload } from "../../core/Helper"

export async function Create(req:any) {
    return await fileUpload('eleysia-upload',req.body.files,true);
}
