export type NewUser = {
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    profile_picture?: string | File;
};

export type AddedUser = {
    id:string,
    firstname:string,
    lastname:string,
    email:string,
    password:string,
    profile_picture:string
}