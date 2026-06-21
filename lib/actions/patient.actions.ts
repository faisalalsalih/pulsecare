"use server"


import { Query, ID, InputFile } from "node-appwrite";
import { DATABASE_ID, databases, NEXT_PUBLIC_BUCKET_ID, NEXT_PUBLIC_ENDPOINT, PATIENT_COLLECTION_ID, users, PROJECT_ID } from "../appwrite.config"
import { parseStringify } from "../utils";
import { storage } from "../appwrite.config";


export const createUser = async (user: CreateUserParams) => {

    try {
        
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name);

        return newUser;
    }
    catch (error: any) {

        if (error && error?.code === 409) {

            const existingUser = await users.list([
                Query.equal('email', [user.email])
            ])

            return existingUser?.users[0];

        }
    }
}


export const getUser = async (userId: string) => {
    try{

        const user = await users.get(userId);

        return parseStringify(user);

    }
    catch (error){
        console.log(error);
    }
}


export const registerPatient = async ({ identificationDocument, ...patient } : RegisterUserParams) => {
    try {
        
        let file;

        if(identificationDocument) {

            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string
            )

            file = await storage.createFile(NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile);

        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            }
        )


        return parseStringify(newPatient);


    } catch (error) {
        console.log(error);
    }
}


